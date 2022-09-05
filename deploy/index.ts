import * as k8s from "@pulumi/kubernetes";
import * as civo from "@pulumi/civo";
import { Command } from "@pulumi/command/local";

const firewall = new civo.Firewall("civo-firewall", {
  name: "gitops-laravel",
  region: "LON1",
  createDefaultRules: true,
});

// setup a new cluster
const cluster = new civo.KubernetesCluster("civo-k3s-cluster", {
  name: "gitops-laravel",
  pools: {
    nodeCount: 3,
    size: "g4s.kube.small"
  },
  region: "LON1",
  firewallId: firewall.id,
})

export const clusterName = cluster.name

// const devCluster = new civo.KubernetesCluster('civo-k3s-dev-cluster', {
//   name: 'laravel-dev',
//   pools: {
//     nodeCount: 3,
//     size: 'g4s.kube.small'
//   },
//   region: 'LON1',
//   firewallId: firewall.id,
// })

// setup our gitops needs
let provider = new k8s.Provider('default-k8s-provider', {
  kubeconfig: cluster.kubeconfig,
})

const argoNamespace = new k8s.core.v1.Namespace('argocd', {
  metadata: {
    name: 'argocd',
  }
}, { provider })

provider = new k8s.Provider('argo-k8s-provider', {
  kubeconfig: cluster.kubeconfig,
  namespace: argoNamespace.metadata.name,
})

const argo = fetch('https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml')
  .then(r => r.text())
  .then(yaml => new k8s.yaml.ConfigGroup('argoCD', { yaml }, { provider }));

// First, we have to create the namespace and install the CRDs manually, as the helm chart doesn't ship with them
const emissaryNamespace = new k8s.core.v1.Namespace('emissary', {
  metadata: {
    name: 'emissary'
  }
}, { provider })

const emissaryCRDs = fetch('https://app.getambassador.io/yaml/emissary/3.1.0/emissary-crds.yaml')
  .then(r => r.text())
  .then(yaml => new k8s.yaml.ConfigGroup('emissaryCRDs', { yaml }, { provider }))

// Then we deploy the `Application` resource to the cluster, to install our API GW
const emissary = new k8s.yaml.ConfigFile('emissary-helm-app', {
  file: 'manifests/emissary-ingress.yaml'
}, {
  provider,
  dependsOn: [emissaryNamespace, emissaryCRDs],
  transformations: [(data: any) => {
    if (data.props?.spec?.destination) {
      data.props.spec.destination.namespace = emissaryNamespace.metadata.name
    }

    return data
  }]
})
