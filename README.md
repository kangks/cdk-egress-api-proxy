
# Egress API Proxy Constructs for AWS CDK

This project contains AWS CDK constructs to set up an API Gateway with a VPC endpoint for secure outbound traffic (egress) management. The main constructs are:

- `EgressApiProxyConstruct`: Sets up a private API Gateway with a proxy integration to an external API endpoint.
- `EgressApiProxyVpcEndpointConstruct`: Creates a VPC endpoint for the API Gateway to securely manage network traffic.

## Getting Started

### Prerequisites

- [AWS CDK](https://aws.amazon.com/cdk/) installed
- Node.js installed
- AWS CLI configured
- Basic knowledge of TypeScript and AWS CDK

### Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/kangks/cdk-egress-api-proxy.git
    cd egress-api-proxy-construct
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

### Configuration

1. Create a `config.json` file in the root of the project with the following structure:

    ```json
    {
      "dev": {
        "stack-prefix": "dev",
        "vpcId": "vpc-123456",
        "subnets": [
          { "avaialbilityZone": "us-east-1a", "subnetId": "subnet-123456" }
        ],
        "cidrAPIcallee": "0.0.0.0/0",
        "rootResource": "api"
      }
    }
    ```

    Adjust the values to match your AWS environment.

### Usage

1. The example provided in `egress-api-proxy.ts` demonstrates how to use `EgressApiProxyConstruct` and `EgressApiProxyVpcEndpointConstruct`:

    ```typescript
    import 'source-map-support/register';
    import * as cdk from 'aws-cdk-lib';
    import * as proxy from './egress-api-proxy-construct';
    import { EgressApiProxyVpcEndpointConstruct } from './lib/EgressApiProxyVpcEndpointConstruct';

    const config = require('./config.json');

    const app = new cdk.App();
    const stageName = app.node.tryGetContext('stageName');
    const prefix = config[stageName]['stack-prefix'];

    // API Stack
    const stack = new cdk.Stack(app, `${prefix}-api-stack`);
    const construct = new proxy.EgressApiProxyConstruct(stack, prefix, {
      vpcId: config[stageName]['vpcId'],
      subnets: config[stageName]['subnets'],
      cidrAPIcallee: config[stageName]['cidrAPIcallee'],
      rootResource: config[stageName]['rootResource'],
    });

    // VPC Endpoint Stack
    const vpcStack = new cdk.Stack(app, `${prefix}-vpce-stack`);
    const vpce = new EgressApiProxyVpcEndpointConstruct(vpcStack, `${prefix}-vpce`, {
      vpcId: config[stageName]['vpcId'],
      subnets: config[stageName]['subnets'],
      CidrAPIcallee: config[stageName]['CidrAPIcallee'],
    });
    vpce.node.addDependency(construct);
    ```

3. Deploy this CDK application to your AWS environment.
    ```bash
    npx cdk deploy --context stageName=dev
    ```


### Clean Up

To delete the created resources, run:

```bash
npx cdk destroy --context stageName=dev
```

## License

This project is licensed under the MIT License.
