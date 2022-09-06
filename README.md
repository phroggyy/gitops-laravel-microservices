# Laravel microservices with GitOps

This repo is all the code I've written in the process of deepening my understanding of cloud native and microservices
with Laravel.

## Why Laravel

Laravel provides what I'd consider an unparalleled developer experience, compared to any other framework in any other
programming language. Additionally, it is an interesting challenge to combine with modern concepts like microservices
and GitOps, which are (in my experience) not particularly popular or well talked about in the Laravel sphere.

Additionally, I've been reasonably involved in the Laravel ecosystem for more than 5 years by now, and it's a
community I would like to contribute new knowledge to, and inspire new functionality to be adopted into the framework.

## Why microservices

Most times when people think microservices, they think about massive high-tech companies needing to scale massively.
And while it's true that microservices allows greater efficiency (and thus cost savings) at scale through service-level
scaling, that's not the case for most of us. However, they do provide other advantages if done right.

The first matter is reliability & availability. Of course you can achieve high reliability with monoliths too, but in
splitting your application up, you can define different availability requirements for different functionalities.

The second piece is developer experience. This is hit or miss, and it's very easy to go wrong. In a way, that's why this
repo exists - to steer you clear of bad ideas. When executed well, microservices can be developed independently,
giving your team a great benefit, particularly if you have a very wide application where every developer doesn't need to
know every bit. That is further multiplied when you have multiple teams, that can now take true ownership of _just their piece_.

## Development

### Prerequisites

1. You need to have pulumi installed to setup the infrastructure from local. This repo also has a Github action
   to do it in CI. To set it up from local, run `brew install pulumi/tap/pulumi` if you're on a mac. Also install NodeJS.
2. This deploys onto Kubernetes, so you should have the kubernetes CLI (`kubectl`) on your machine.
3. The cluster in Pulumi is configured on top of [Civo](https://civo.com) (where you can sign up and get $250 of credits,
   and the clusters are cheap), so I recommend installing the `civo` CLI following the docs: https://www.civo.com/docs/cli/617, and connect to it (`civo apikey add`) .


## Deployment

1. Set your Civo API key: `pulumi config set civo:token XXXXXXXXXXXXXX --secret`
1. Run `pulumi up`. This will create a Kubernetes cluster with ArgoCD installed.
1. Load your `kubeconfig` file from Civo: `civo k8s config -s gitops-laravel`
1. Switch Kubernetes context: `kubectl config use-context gitops-laravel`
1. Ensure you have a connection: `kubectl get ns` (you should also see your argo namespace here)