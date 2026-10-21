import type { Lesson } from '../../types';

export const lesson: Lesson = {
  id: 'm03-network-and-threat-protection',
  title: 'Network and application protection: Shield, WAF and Firewall Manager',
  topic: 'Security services',
  subtopic: 'DDoS protection, web application firewall and central firewall policy',
  taskStatements: ['2.4'],
  minutes: 15,
  keywords: ['AWS Shield', 'Shield Standard', 'Shield Advanced', 'DDoS', 'AWS WAF', 'web application firewall', 'web ACL', 'rate-based rule', 'SQL injection', 'cross-site scripting', 'XSS', 'AWS Firewall Manager', 'Shield Response Team', 'SRT', 'bot control', 'managed rules'],
  objectives: [
    'Explain what a DDoS attack is and how AWS Shield Standard and AWS Shield Advanced differ.',
    'Describe what AWS WAF protects against (web exploits) and where it can be attached.',
    'Explain what AWS Firewall Manager adds on top of AWS WAF and AWS Shield Advanced.',
    'Match a threat (volumetric flood, SQL injection, inconsistent rules across accounts) to the right service.',
    'Recognise that security groups and network ACLs are separate VPC-level controls taught in Module 8.',
  ],
  explanation: [
    'Three AWS services protect the edges of your network and applications, and exam questions are mostly about telling them apart. **AWS Shield** defends against **DDoS (distributed denial of service)** attacks, where huge volumes of traffic or requests try to make your application unavailable. **AWS WAF** is a **web application firewall** that filters individual HTTP(S) requests to block **web exploits** such as SQL injection, cross-site scripting and abusive bots. **AWS Firewall Manager** is a **central management** service that lets you roll out and enforce firewall rules, such as WAF and Shield Advanced protections, across many accounts and resources in AWS Organizations.',
    '**AWS Shield Standard** is automatic and included for **all AWS customers at no additional charge**. It defends against the most common, frequently occurring network- and transport-layer (layer 3 and 4) DDoS attacks against your AWS resources and works with services such as Amazon CloudFront and Amazon Route 53 to keep applications available. You do not turn it on; it is simply there.',
    '**AWS Shield Advanced** is an **optional paid subscription** with higher levels of protection for Amazon EC2 (through Elastic IP addresses), Elastic Load Balancing, Amazon CloudFront, AWS Global Accelerator and Amazon Route 53 resources. It adds detection tailored to your application’s traffic, protection against larger and more sophisticated attacks including application-layer floods, near real-time visibility into attacks, access to the **AWS Shield Response Team (SRT)** during active events, and **DDoS cost protection** that helps safeguard against scaling charges caused by an attack on protected resources.',
    '**AWS WAF** works at the application layer (layer 7). You create a **web ACL** made of rules that inspect the contents of web requests: IP addresses, countries, headers, query strings, request bodies. Rules can **allow, block, count or challenge** matching requests. You can write your own rules, use **AWS managed rule groups** (for common threats such as SQL injection and cross-site scripting) or marketplace rule groups, and add **rate-based rules** to limit how many requests a client can send in a time window. A web ACL is attached to a supported resource such as an **Amazon CloudFront** distribution, an **Application Load Balancer**, an **Amazon API Gateway** REST API, an AWS AppSync GraphQL API, an Amazon Cognito user pool, an AWS App Runner service, an AWS Verified Access instance or AWS Amplify (the list grows over time, so check the current documentation).',
    '**AWS Firewall Manager** solves the “many accounts, many applications” problem. Using AWS Organizations, an administrator defines **policies** once (for example “every Application Load Balancer must have this web ACL”, “protect all CloudFront distributions with Shield Advanced”, or a standard set of security group rules) and Firewall Manager **automatically applies them to existing and new accounts and resources**, and audits for non-compliance. It does not replace WAF or Shield; it orchestrates them (and other firewall types) at scale.',
    '**Security groups** and **network ACLs** (NACLs) are separate network controls inside an Amazon VPC: security groups are stateful firewalls at the instance/network interface level and NACLs are stateless filters at the subnet level. They are covered in Module 8 (VPC security). A common exam trap is offering WAF or Shield where the scenario really calls for a security group rule or the reverse: **ports and IP allow-lists inside a VPC → security group/NACL; malicious web requests → WAF; flood of traffic → Shield; consistent rules across the organization → Firewall Manager**.',
  ],
  analogy:
    'Picture a concert venue. Shield is the crowd-control barrier on the street that stops a stampede from reaching the doors (volumetric DDoS). WAF is the security guard at the entrance who looks inside each visitor’s bag and refuses anyone carrying prohibited items (malicious request content). Security groups and NACLs are the locks on the individual rooms inside. Firewall Manager is the head of security who writes one rulebook and makes sure every venue in the chain follows it.',
  example:
    'An online retailer serves its shop through Amazon CloudFront and an Application Load Balancer. Shield Standard automatically absorbs common network floods. The security team attaches an AWS WAF web ACL with managed rules for SQL injection and cross-site scripting plus a rate-based rule that blocks any IP address sending an abnormal number of requests. Because the company subscribes to Shield Advanced for its flagship site, it can call the Shield Response Team during an attack and is protected from DDoS-related scaling charges. With 30 accounts across the company, the central security team uses AWS Firewall Manager to ensure every new load balancer automatically gets the standard web ACL.',
  deepDives: [
    {
      title: 'Layers: where each service operates',
      body: [
        '**Layer 3/4 (network and transport)**: volumetric floods and protocol attacks such as SYN floods or reflection attacks. AWS Shield Standard and Advanced handle these. **Layer 7 (application)**: HTTP floods and exploit attempts such as SQL injection; AWS WAF inspects these requests, and Shield Advanced can work with WAF to respond to application-layer DDoS events.',
        'You do not need packet-level detail for the exam. Remember: **Shield = availability under attack; WAF = request content filtering**.',
      ],
    },
    {
      title: 'AWS WAF building blocks',
      body: [
        'A **web ACL** contains **rules** and **rule groups** and has a default action (allow or block) for requests that match nothing. Rules can match conditions such as source IP set, geographic origin, size, string patterns, SQL injection or cross-site scripting patterns, and can be combined with logical operators. **Rate-based rules** count requests per source and take action when a threshold is exceeded.',
        'WAF is a Regional service for resources such as an Application Load Balancer or API Gateway, and is used globally with CloudFront distributions. **Bot Control** and fraud-prevention features are optional add-ons for specific use cases.',
      ],
    },
    {
      title: 'What Firewall Manager can manage',
      body: [
        'Firewall Manager policies can cover AWS WAF web ACLs, AWS Shield Advanced protections, Amazon VPC security groups, AWS Network Firewall, Amazon Route 53 Resolver DNS Firewall, network ACLs and third-party firewalls from AWS Marketplace. It needs AWS Organizations and a designated Firewall Manager administrator account, and it protects both existing and newly created resources that match the policy scope. Remember the exam level: “**central management of firewall rules across accounts**”.',
      ],
    },
    {
      title: 'Testing and the DDoS simulation policy',
      body: [
        'AWS allows many security assessments of your own resources without prior approval, but prohibits denial-of-service attacks or simulations of them; customers who want to run a DDoS simulation test must follow AWS’s separate DDoS simulation testing policy. See the penetration testing overview in the security resources lesson.',
      ],
    },
  ],
  howItWorks: [
    'Traffic from users and attackers first reaches AWS edge locations and the Region’s network; **Shield Standard** automatically detects and mitigates common layer 3/4 attacks without configuration.',
    'If you subscribe to **Shield Advanced**, you select the resources to protect (for example a CloudFront distribution, an Application Load Balancer or an Elastic IP address); Shield tunes detection to the application’s normal traffic and can engage mitigations and the Shield Response Team.',
    'For **AWS WAF**, you create a web ACL, add rules or managed rule groups, choose actions (allow, block, count, challenge) and associate the web ACL with a CloudFront distribution, load balancer, API or other supported resource. Each request is evaluated before it reaches your application.',
    'With **AWS Firewall Manager**, a Firewall Manager administrator in AWS Organizations creates policies with a scope (accounts, resource types, tags); Firewall Manager applies them and continues to evaluate new resources, reporting compliance.',
  ],
  whenToUse: [
    'Rely on **Shield Standard** for baseline DDoS protection for every workload; add **Shield Advanced** for business-critical internet-facing applications that need extra detection, response-team access and cost protection.',
    'Use **AWS WAF** for public web applications and APIs that need protection from SQL injection, cross-site scripting, bad bots or request flooding.',
    'Use **AWS Firewall Manager** when many accounts and applications must follow consistent firewall and DDoS-protection policies managed centrally.',
  ],
  limitations: [
    'Shield Standard offers broad automatic protection but no custom protections or response-team access; those require Shield Advanced.',
    'AWS WAF inspects web requests (HTTP/HTTPS); it is not a replacement for security groups or NACLs and does not protect non-web protocols.',
    'AWS Firewall Manager depends on AWS Organizations and an administrator account, and it manages policies rather than detecting threats by itself.',
    'None of these services removes the need for secure application code and patching: under shared responsibility they reduce risk but do not guarantee immunity from attack.',
  ],
  keyTerms: [
    { term: 'DDoS attack', definition: 'A distributed denial of service attack that floods a target with traffic or requests from many sources to make it unavailable.' },
    { term: 'AWS Shield Standard', definition: 'Automatic, no-extra-cost protection for all AWS customers against common network and transport layer DDoS attacks.' },
    { term: 'AWS Shield Advanced', definition: 'Optional paid DDoS protection with enhanced detection, Shield Response Team access, application-layer protection and DDoS cost protection.' },
    { term: 'AWS WAF', definition: 'A web application firewall that filters HTTP(S) requests with rules to block web exploits and abusive traffic.' },
    { term: 'Web ACL', definition: 'The AWS WAF resource that contains rules and a default action and is associated with protected resources.' },
    { term: 'Rate-based rule', definition: 'A WAF rule that limits the number of requests from a source within a time window.' },
    { term: 'AWS Firewall Manager', definition: 'Service that centrally configures and enforces firewall policies, such as WAF and Shield Advanced, across accounts in AWS Organizations.' },
    { term: 'Shield Response Team (SRT)', definition: 'AWS DDoS experts that Shield Advanced customers can engage during attacks.' },
    { term: 'SQL injection / cross-site scripting', definition: 'Common web exploits where malicious input is used to manipulate a database or inject script into pages; AWS WAF rules detect them.' },
  ],
  related: [
    { lessonId: 'm08-vpc-security', why: 'Security groups and network ACLs are the VPC-level firewalls that complement WAF and Shield.' },
    { lessonId: 'm08-dns-and-content-delivery', why: 'CloudFront and Route 53 are common places where Shield and WAF protect traffic at the edge.' },
    { lessonId: 'm03-detection-and-posture-services', why: 'GuardDuty, Inspector and Macie detect threats and weaknesses, while Shield and WAF actively block attacks.' },
    { lessonId: 'm12-organizations-and-tags', why: 'AWS Firewall Manager relies on AWS Organizations to manage policies across accounts.' },
  ],
  mistakes: [
    'Using **AWS WAF** as the answer to a volumetric DDoS question; DDoS protection is **AWS Shield** (WAF handles web request content).',
    'Believing Shield Standard has to be purchased or enabled. It is automatic and free for all customers; **Shield Advanced** is the paid option.',
    'Choosing **AWS Firewall Manager** as a firewall itself. It manages firewall policies centrally; it does not inspect traffic on its own.',
    'Confusing **security groups** (stateful, instance level) and **network ACLs** (stateless, subnet level) with WAF; they live in the VPC and are covered in Module 8.',
    'Assuming WAF protects EC2 instances directly: a web ACL attaches to supported resources such as CloudFront, ALB or API Gateway.',
  ],
  examTips: [
    'Keywords: “**DDoS**, volumetric, SYN flood, keep availability” → **AWS Shield**; “**SQL injection**, cross-site scripting, block IP addresses or countries, rate limiting web requests” → **AWS WAF**; “**centrally manage** firewall rules across **multiple accounts**/AWS Organizations” → **AWS Firewall Manager**.',
    '“No additional charge, all customers, automatic” → **Shield Standard**; “Shield Response Team, DDoS cost protection, enhanced protection for critical apps” → **Shield Advanced**.',
    'If the scenario mentions allowing or blocking a **port** or **CIDR range** for instances, think **security groups / NACLs**, not WAF.',
    'WAF attaches to **CloudFront, Application Load Balancer, API Gateway** (and a few others). Expect questions that place WAF in front of a web application.',
  ],
  comparisons: [
    {
      title: 'Shield vs WAF vs Firewall Manager',
      headers: ['Service', 'Protects against', 'Layer / scope', 'Exam keyword'],
      rows: [
        ['AWS Shield', 'DDoS attacks that aim to make apps unavailable', 'Network/transport layer (Standard); also application-layer events with Advanced', '“DDoS”, “availability”'],
        ['AWS WAF', 'Web exploits: SQL injection, XSS, bad bots, request floods', 'Application layer (HTTP/HTTPS) on CloudFront, ALB, API Gateway and more', '“Web ACL”, “SQL injection”, “block IP/country”'],
        ['AWS Firewall Manager', 'Inconsistent or missing protections across accounts', 'Management layer over WAF, Shield Advanced, security groups, others', '“Centrally manage”, “organization-wide policy”'],
      ],
    },
    {
      title: 'AWS Shield Standard vs AWS Shield Advanced',
      headers: ['Aspect', 'Shield Standard', 'Shield Advanced'],
      rows: [
        ['Cost', 'No additional charge for all customers', 'Optional paid subscription'],
        ['Activation', 'Automatic', 'You subscribe and select resources to protect'],
        ['Protection', 'Common layer 3/4 DDoS attacks', 'Larger, more sophisticated attacks; tailored detection; application-layer DDoS support with WAF'],
        ['Extras', 'None', 'Shield Response Team access, near real-time attack visibility, DDoS cost protection'],
        ['Protected resources', 'AWS resources in general', 'EC2 (Elastic IP), Elastic Load Balancing, CloudFront, Global Accelerator, Route 53'],
      ],
    },
  ],
  memoryAids: [
    '**S**hield = **S**urvive the flood; **W**AF = **W**eb request **W**atchdog; **F**irewall **M**anager = **F**or **M**any accounts.',
    'Standard is **S**tandard issue (free, **S**tarts automatically); Advanced is **A**dd-on (paid, **A**ssist from the response team).',
  ],
  revision: [
    'Shield = DDoS protection; Standard is automatic and free, Advanced is paid with SRT, cost protection and richer detection.',
    'WAF = web ACL with rules (managed, custom, rate-based) filtering HTTP(S) requests; attaches to CloudFront, ALB, API Gateway and more.',
    'Firewall Manager = central policies for WAF, Shield Advanced, security groups and more across Organizations.',
    'DDoS → Shield; SQL injection / XSS → WAF; organization-wide rules → Firewall Manager; ports and CIDRs → security groups/NACLs.',
    'Shield and WAF actively block; GuardDuty, Inspector and Macie detect and report.',
  ],
  diagrams: [
    {
      id: 'edge-protection-layers',
      type: 'layers',
      title: 'Where protection is applied',
      caption: 'From the internet inward.',
      layers: [
        { label: 'AWS Shield (Standard / Advanced)', detail: 'Absorbs DDoS floods at the network and transport layers.' },
        { label: 'AWS WAF web ACL', detail: 'Filters web requests on CloudFront, ALB or API Gateway.' },
        { label: 'Security groups and network ACLs', detail: 'VPC-level traffic filters for instances and subnets (Module 8).' },
        { label: 'Your application and data', detail: 'Patched, least-privilege code; protected by IAM and encryption.' },
      ],
    },
    {
      id: 'threat-to-service',
      type: 'columns',
      title: 'Threat → service',
      columns: [
        { heading: 'DDoS flood', items: ['AWS Shield Standard (automatic)', 'AWS Shield Advanced (paid, SRT)'] },
        { heading: 'Web exploit or bot', items: ['AWS WAF web ACL', 'Managed rule groups', 'Rate-based rules'] },
        { heading: 'Consistency at scale', items: ['AWS Firewall Manager', 'AWS Organizations policies', 'Audit non-compliant resources'] },
      ],
    },
  ],
  references: [
    { title: 'AWS Shield features', url: 'https://aws.amazon.com/shield/features/' },
    { title: 'What is AWS Shield?', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html' },
    { title: 'What is AWS WAF?', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html' },
    { title: 'AWS Firewall Manager', url: 'https://aws.amazon.com/firewall-manager/' },
    { title: 'What is AWS Firewall Manager?', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/fms-chapter.html' },
  ],
  knowledgeCheck: [
    {
      id: 'm03-network-and-threat-protection-k1',
      type: 'single',
      domain: 2,
      taskStatement: '2.4',
      difficulty: 'easy',
      stem: 'Which AWS service automatically protects all AWS customers against common network and transport layer DDoS attacks at no additional charge?',
      options: [
        { id: 'a', text: 'AWS Shield Standard', explanation: 'Correct. Shield Standard is automatic and included for every customer, and it mitigates the most common layer 3 and 4 DDoS attacks.' },
        { id: 'b', text: 'AWS WAF', explanation: 'AWS WAF filters web request content and is configured and billed separately; it is not the automatic DDoS protection.' },
        { id: 'c', text: 'AWS Firewall Manager', explanation: 'Firewall Manager centrally manages firewall policies and is not an automatic DDoS service.' },
        { id: 'd', text: 'Amazon Macie', explanation: 'Macie discovers sensitive data in Amazon S3 and has nothing to do with DDoS protection.' },
      ],
      correct: ['a'],
    },
    {
      id: 'm03-network-and-threat-protection-k2',
      type: 'single',
      domain: 2,
      taskStatement: '2.4',
      difficulty: 'easy',
      stem: 'A company wants to block HTTP requests that contain SQL injection patterns before they reach an Application Load Balancer. Which service should it use?',
      options: [
        { id: 'a', text: 'AWS Shield Advanced', explanation: 'Shield Advanced focuses on DDoS protection; filtering SQL injection patterns in requests is the job of AWS WAF.' },
        { id: 'b', text: 'AWS WAF', explanation: 'Correct. AWS WAF web ACLs can attach to an Application Load Balancer and use rules to block SQL injection and similar exploits.' },
        { id: 'c', text: 'AWS Directory Service', explanation: 'Directory Service provides managed Active Directory options, not web request filtering.' },
        { id: 'd', text: 'Amazon Cognito', explanation: 'Cognito handles user sign-up and sign-in, not inspection of requests for exploits.' },
      ],
      correct: ['b'],
    },
  ],
  practice: [
    {
      id: 'm03-network-and-threat-protection-p1',
      type: 'single',
      domain: 2,
      taskStatement: '2.4',
      difficulty: 'medium',
      stem: 'A company with dozens of AWS accounts in AWS Organizations wants every Application Load Balancer, now and in the future, to have the same AWS WAF rules attached automatically. Which service meets this requirement?',
      options: [
        { id: 'a', text: 'AWS Shield Standard', explanation: 'Shield Standard provides automatic DDoS protection but cannot deploy WAF rules across accounts.' },
        { id: 'b', text: 'Amazon GuardDuty', explanation: 'GuardDuty detects threats; it does not deploy or enforce WAF rules.' },
        { id: 'c', text: 'AWS Firewall Manager', explanation: 'Correct. Firewall Manager applies WAF policies centrally to existing and new resources across accounts in an organization.' },
        { id: 'd', text: 'AWS Trusted Advisor', explanation: 'Trusted Advisor gives recommendations for cost, security and more but does not enforce firewall policies.' },
      ],
      correct: ['c'],
    },
    {
      id: 'm03-network-and-threat-protection-p2',
      type: 'single',
      domain: 2,
      taskStatement: '2.4',
      difficulty: 'medium',
      stem: 'An e-commerce company runs a business-critical website on Amazon CloudFront and Elastic Load Balancing. Leadership wants expert help during a DDoS attack and protection against scaling costs caused by attack traffic. What should the company use?',
      options: [
        { id: 'a', text: 'AWS Shield Standard only', explanation: 'Shield Standard does not include Shield Response Team access or DDoS cost protection.' },
        { id: 'b', text: 'AWS WAF rate-based rules only', explanation: 'Rate-based rules help limit request floods but do not provide response-team access or cost protection.' },
        { id: 'c', text: 'Security groups on the load balancer', explanation: 'Security groups filter traffic by port and source but do not give DDoS expertise or cost protection.' },
        { id: 'd', text: 'AWS Shield Advanced', explanation: 'Correct. Shield Advanced adds Shield Response Team access, enhanced detection and DDoS cost protection for protected resources such as CloudFront and load balancers.' },
      ],
      correct: ['d'],
    },
    {
      id: 'm03-network-and-threat-protection-p3',
      type: 'multi',
      domain: 2,
      taskStatement: '2.4',
      difficulty: 'medium',
      stem: 'Which TWO statements about AWS WAF are correct? (Select TWO.)',
      options: [
        { id: 'a', text: 'It can be associated with resources such as Amazon CloudFront distributions and Application Load Balancers.', explanation: 'Correct. A web ACL attaches to supported resources including CloudFront, Application Load Balancers and API Gateway.' },
        { id: 'b', text: 'Rate-based rules can limit how many requests a single source sends in a time window.', explanation: 'Correct. Rate-based rules count requests per source and can block or otherwise act when the threshold is exceeded.' },
        { id: 'c', text: 'It automatically absorbs volumetric layer 3 and 4 floods for every customer at no cost.', explanation: 'That describes AWS Shield Standard, not AWS WAF.' },
        { id: 'd', text: 'It centrally enforces security policies across all accounts in an organization by itself.', explanation: 'Centralized enforcement across accounts is the role of AWS Firewall Manager, which can deploy WAF policies.' },
        { id: 'e', text: 'It scans EC2 instances for software vulnerabilities.', explanation: 'Scanning workloads for vulnerabilities is the job of Amazon Inspector.' },
      ],
      correct: ['a', 'b'],
    },
  ],
};
