import * as cdk from 'aws-cdk-lib';

export interface EgressApiProxyConstructPropsSubnetType {
  readonly avaialbilityZone:string, 
  readonly subnetId:string
}

export interface EgressApiProxyConstructProps extends cdk.StackProps{
  readonly  vpcId: string,
  readonly  subnets: EgressApiProxyConstructPropsSubnetType[],
  readonly  cidrAPIcallee: string,
  readonly  rootResource?: string,
  readonly  baseUrl?: string,
}
