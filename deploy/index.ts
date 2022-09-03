import * as k8s from "@pulumi/kubernetes";
import * as civo from "@pulumi/civo";

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

// setup our gitops needs
let provider = new k8s.Provider('default-k8s-provider', {
  kubeconfig: cluster.kubeconfig,
})

const argoNamespace = new k8s.core.v1.Namespace('argocd', {}, { provider })

provider = new k8s.Provider('argo-k8s-provider', {
  kubeconfig: cluster.kubeconfig,
  namespace: argoNamespace.metadata.name,
})

const argo = fetch('https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml')
  .then(r => r.text())
  .then(yaml => new k8s.yaml.ConfigGroup('argoCD', { yaml }, { provider }));
