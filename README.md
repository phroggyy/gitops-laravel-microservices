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
