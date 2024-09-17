import * as cdk from 'aws-cdk-lib';

export interface EgressApiProxyConstructProps extends cdk.StackProps{
  vpcId: string,
  subnets: {avaialbilityZone:string, subnetId:string}[],
  CidrAPIcallee: string,
  baseUrl?: string,
}
