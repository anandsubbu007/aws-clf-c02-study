import type { Lesson } from '../../types';

// Exemplar lesson: shows the expected depth, tone and structure for every lesson on the site.
export const lesson: Lesson = {
      id: 'm01-value-of-aws-cloud',
      title: 'The value of the AWS Cloud',
      topic: 'Benefits of the AWS Cloud',
      subtopic: 'Value proposition and core cloud properties',
      taskStatements: ['1.1'],
      minutes: 14,
      keywords: ['six advantages', 'elasticity', 'agility', 'high availability', 'fault tolerance', 'scalability', 'pay as you go', 'capex', 'opex'],
      objectives: [
        'Explain the six advantages of cloud computing in your own words.',
        'Distinguish elasticity, scalability, agility, high availability and fault tolerance.',
        'Describe how the AWS global infrastructure speeds up deployment and extends global reach.',
        'Recognise which benefit a scenario describes (for example “stop guessing capacity” or “go global in minutes”).',
      ],
      explanation: [
        'Cloud computing means renting IT resources (servers, storage, databases, networking) over the internet from a provider such as AWS and **paying only for what you use**, instead of buying and running your own data centre. Resources are available in minutes through a console, command line or API.',
        'AWS summarises the value of the cloud as **six advantages**: (1) trade fixed expense for variable expense, (2) benefit from massive economies of scale, (3) stop guessing capacity, (4) increase speed and agility, (5) stop spending money running and maintaining data centres, and (6) go global in minutes. Exam questions usually describe a situation and ask which advantage applies, so learn them as short phrases.',
        'Four related *properties* are easy to mix up. **Scalability** is the ability to handle more load by adding resources. **Elasticity** is scaling *out and back in* automatically as demand changes so you pay only for what you need. **High availability** means the workload keeps running with minimal downtime, typically by spreading it across multiple Availability Zones. **Fault tolerance** goes one step further: the workload continues without interruption even when a component fails. **Agility** is about how fast you can try, change and release things.',
        'The **AWS global infrastructure** (Regions, Availability Zones and edge locations) underpins several benefits at once: you can deploy a copy of your application near customers on another continent within minutes (global reach), and you can design for resilience by using several isolated Availability Zones.',
      ],
      analogy:
        'Think of electricity. Instead of building a private power plant (fixed cost, sized for your peak, mostly idle), you plug into the grid and pay for the kilowatt-hours you use. The utility has enormous scale, so the price per unit is lower, and you can switch on a new factory floor without waiting for a generator to be delivered.',
      example:
        'A retailer runs a promotion twice a year. On premises it must buy servers for the peak and they sit mostly idle. On AWS it runs a small fleet most of the year and uses Auto Scaling to add instances during the promotion, then scales back in. It pays only for the extra capacity while the sale runs (variable expense, elasticity, stop guessing capacity), and it can launch a storefront in another Region for new customers in an afternoon (go global in minutes).',
      deepDives: [
        {
          title: 'Scalability vs elasticity vs high availability vs fault tolerance',
          body: [
            '**Scalability** answers “can it grow?”. **Elasticity** answers “can it grow *and shrink* automatically with demand?”. A system can be scalable without being elastic (you add servers manually).',
            '**High availability (HA)** is about *uptime*: no single point of failure, so that a failure causes little or no downtime — for example an application behind a load balancer across two Availability Zones. **Fault tolerance** is a stronger target: no interruption at all while a component fails, which usually costs more because of redundancy.',
            'On the exam, “keep running if an Availability Zone fails” points to **high availability using multiple AZs**. “Handle unpredictable traffic and reduce cost when quiet” points to **elasticity**.',
          ],
        },
        {
          title: 'What “economies of scale” really means',
          body: [
            'AWS aggregates the usage of hundreds of thousands of customers. This high volume lets AWS buy hardware, power and network capacity at lower cost than any single organisation can, and AWS passes part of those savings on as lower pay-as-you-go prices.',
          ],
        },
      ],
      howItWorks: [
        'You request resources through the **AWS Management Console, AWS CLI, SDKs or APIs**; they are provisioned in minutes rather than weeks.',
        'Usage is **metered**: you are billed for compute time, storage consumed, requests made and data transferred out, and so on (billing details are covered in Domain 4).',
        'Capacity can follow demand: services such as **Amazon EC2 Auto Scaling** add or remove instances based on rules or schedules.',
        'Resilience is built by placing resources in **multiple Availability Zones** and, where needed, in multiple **Regions**.',
      ],
      whenToUse: [
        'Workloads with variable or unpredictable demand, where paying only for what you use beats owning peak capacity.',
        'Teams that need to experiment quickly and cheaply (development, testing, new products).',
        'Organisations that need to reach customers in new geographies without building data centres there.',
      ],
      limitations: [
        'Moving to the cloud does not remove all responsibility: security *in* the cloud, cost governance and good architecture remain the customer’s job (see shared responsibility).',
        'Steady, predictable workloads can be cheaper with commitment-based pricing, and some workloads have latency, data-residency or licensing constraints that favour a hybrid design.',
        'Elasticity is not automatic: you must configure the scaling services and design the application to scale out.',
      ],
      keyTerms: [
        { term: 'Cloud computing', definition: 'On-demand delivery of IT resources over the internet with pay-as-you-go pricing.' },
        { term: 'Elasticity', definition: 'The ability to acquire resources as you need them and release them when you no longer do, usually automatically, so capacity matches demand.' },
        { term: 'Scalability', definition: 'The ability of a system to handle increased load by adding resources (scale up/vertically or scale out/horizontally).' },
        { term: 'High availability', definition: 'Designing a workload to stay operational with minimal downtime, typically by removing single points of failure and using multiple Availability Zones.' },
        { term: 'Fault tolerance', definition: 'The ability of a workload to keep operating without interruption when one or more components fail.' },
        { term: 'Agility', definition: 'The speed at which you can provision resources, experiment and release changes; the cloud reduces provisioning time from weeks to minutes.' },
        { term: 'Economies of scale', definition: 'Lower unit costs achieved because AWS aggregates usage from many customers; reflected in lower pay-as-you-go prices.' },
        { term: 'Variable expense', definition: 'A cost that rises and falls with usage (operating expense) as opposed to a fixed up-front capital investment.' },
      ],
      related: [
        { lessonId: 'm01-cloud-economics', why: 'Dives deeper into fixed vs variable cost, TCO, rightsizing and automation.' },
        { lessonId: 'm01-well-architected-framework', why: 'Reliability and cost pillars turn these benefits into design principles.' },
        { lessonId: 'm05-global-infrastructure', why: 'Regions, Availability Zones and edge locations enable high availability and global reach.' },
      ],
      mistakes: [
        'Treating **scalability** and **elasticity** as identical. Elasticity adds the idea of scaling back in automatically as demand drops.',
        'Confusing **high availability** with **fault tolerance**: HA minimises downtime; fault tolerance aims for zero interruption.',
        'Believing the cloud is always cheaper. The advantage is *variable, usage-based* cost and scale benefits; poorly governed usage can still be expensive.',
        'Thinking “go global in minutes” means one deployment is automatically global. You still deploy into each Region you want to serve.',
      ],
      examTips: [
        'Match scenario keywords to advantages: “unpredictable traffic” → elasticity / stop guessing capacity; “no up-front investment” → trade fixed for variable expense; “launch in another country quickly” → go global in minutes; “experiment quickly” → speed and agility.',
        'If a question says “remains operational if an Availability Zone becomes unavailable”, the concept is **high availability** through multiple AZs.',
        'Capital expenditure (CapEx) is up-front spending on assets; operating expenditure (OpEx) is ongoing, usage-based spending. The cloud shifts spend from CapEx to OpEx.',
      ],
      comparisons: [
        {
          title: 'Look-alike concepts',
          headers: ['Concept', 'Core idea', 'Typical AWS example'],
          rows: [
            ['Scalability', 'Handle growth by adding resources', 'Moving to a larger EC2 instance size or adding instances'],
            ['Elasticity', 'Scale out and back in automatically with demand', 'EC2 Auto Scaling group that grows during peak and shrinks afterwards'],
            ['High availability', 'Minimal downtime; no single point of failure', 'Application servers behind a load balancer in two or more Availability Zones'],
            ['Fault tolerance', 'No interruption when a component fails', 'Redundant components so a failed instance or disk is invisible to users'],
            ['Agility', 'Speed of experimenting and releasing', 'Provisioning a test environment in minutes with infrastructure as code'],
          ],
        },
      ],
      memoryAids: [
        'The six advantages: **“Fixed to variable, Scale economies, Stop guessing, Speed, Stop data-centre chores, Go global”** — F-S-S-S-S-G.',
        '**E**lasticity = **E**xpand *and* **E**ase back. **H**igh availability = **H**ardly any downtime. **F**ault tolerance = **F**ailure invisible.',
      ],
      revision: [
        'Six advantages: variable expense, economies of scale, stop guessing capacity, speed and agility, stop running data centres, go global in minutes.',
        'Elasticity = scale out and in with demand; scalability = able to grow.',
        'High availability = minimal downtime (multiple AZs); fault tolerance = no interruption.',
        'Cloud shifts CapEx to OpEx and uses pay-as-you-go pricing.',
        'Global infrastructure provides speed of deployment and global reach.',
      ],
      diagrams: [
        {
          id: 'six-advantages',
          type: 'mindmap',
          title: 'Six advantages of cloud computing',
          caption: 'Click a branch to expand it. Source: AWS Overview whitepaper.',
          center: 'Value of the AWS Cloud',
          branches: [
            { label: 'Trade fixed for variable expense', items: ['No up-front data-centre purchase', 'Pay only for what you consume'] },
            { label: 'Economies of scale', items: ['AWS aggregates usage', 'Lower pay-as-you-go prices'] },
            { label: 'Stop guessing capacity', items: ['Scale up or down on demand', 'No idle servers or shortages'] },
            { label: 'Speed and agility', items: ['Resources in minutes', 'Experiment cheaply and quickly'] },
            { label: 'Stop running data centres', items: ['Focus on projects and customers', 'No racking, stacking, powering'] },
            { label: 'Go global in minutes', items: ['Deploy in multiple Regions', 'Lower latency for users'] },
          ],
        },
      ],
      references: [
        { title: 'AWS Overview: Six advantages of cloud computing', url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html' },
        { title: 'What is cloud computing? (AWS)', url: 'https://aws.amazon.com/what-is-cloud-computing/' },
        { title: 'AWS Global Infrastructure', url: 'https://aws.amazon.com/about-aws/global-infrastructure/' },
      ],
      knowledgeCheck: [
        {
          id: 'm01-value-of-aws-cloud-k1',
          type: 'single',
          domain: 1,
          taskStatement: '1.1',
          difficulty: 'easy',
          stem: 'A company no longer wants to make a large up-front purchase of servers and instead wants costs that follow usage. Which cloud advantage does this describe?',
          options: [
            { id: 'a', text: 'Trade fixed expense for variable expense', explanation: 'Correct. Moving from up-front capital spending to usage-based operating costs is the first of the six advantages of cloud computing.' },
            { id: 'b', text: 'Go global in minutes', explanation: 'This advantage is about deploying in multiple Regions quickly to be close to customers, not about how costs are structured.' },
            { id: 'c', text: 'Fault tolerance', explanation: 'Fault tolerance describes continuing to operate through component failures; it says nothing about how spending is structured.' },
            { id: 'd', text: 'Data sovereignty', explanation: 'Data sovereignty concerns where data is stored and which laws apply, not the cost model.' },
          ],
          correct: ['a'],
        },
        {
          id: 'm01-value-of-aws-cloud-k2',
          type: 'single',
          domain: 1,
          taskStatement: '1.1',
          difficulty: 'easy',
          stem: 'Which term describes automatically adding capacity when demand rises and removing it when demand falls?',
          options: [
            { id: 'a', text: 'Elasticity', explanation: 'Correct. Elasticity is acquiring resources as needed and releasing them when no longer needed, so capacity tracks demand.' },
            { id: 'b', text: 'Durability', explanation: 'Durability describes how unlikely stored data is to be lost; it is not about adjusting capacity to demand.' },
            { id: 'c', text: 'Latency', explanation: 'Latency is the delay in communication between a user and a resource; it does not describe changing capacity.' },
            { id: 'd', text: 'Portability', explanation: 'Portability refers to moving workloads between environments; it is not an AWS term for matching capacity to demand.' },
          ],
          correct: ['a'],
        },
      ],
      practice: [
        {
          id: 'm01-value-of-aws-cloud-p1',
          type: 'single',
          domain: 1,
          taskStatement: '1.1',
          difficulty: 'medium',
          stem: 'An online game studio cannot predict how many players will join after launch. It wants to avoid both buying too much hardware and running out of capacity. Which benefit of the AWS Cloud does this MOST directly address?',
          options: [
            { id: 'a', text: 'Stop guessing capacity', explanation: 'Correct. With cloud resources you scale up or down to match actual demand instead of estimating in advance and being stuck with idle or insufficient capacity.' },
            { id: 'b', text: 'Increase data-centre control', explanation: 'The cloud lets you stop running data centres; more physical control is not a listed advantage and does not address unpredictable demand.' },
            { id: 'c', text: 'Use perpetual software licences', explanation: 'Licensing models do not solve capacity uncertainty for an unpredictable workload.' },
            { id: 'd', text: 'Reduce the number of AWS Regions', explanation: 'The number of Regions relates to reach and resilience, not matching capacity to unpredictable demand.' },
          ],
          correct: ['a'],
        },
        {
          id: 'm01-value-of-aws-cloud-p2',
          type: 'single',
          domain: 1,
          taskStatement: '1.1',
          difficulty: 'medium',
          stem: 'An application is deployed on EC2 instances behind a load balancer in two Availability Zones. One Availability Zone becomes unavailable and the application keeps serving users with brief or no disruption. Which concept is demonstrated?',
          options: [
            { id: 'a', text: 'Vertical scaling', explanation: 'Vertical scaling means changing the size of an instance; it is not what keeps the application online when an Availability Zone fails.' },
            { id: 'b', text: 'High availability', explanation: 'Correct. Spreading across multiple Availability Zones removes the single point of failure, so a zone outage causes minimal downtime.' },
            { id: 'c', text: 'Data sovereignty', explanation: 'Data sovereignty is about legal jurisdiction over data, not surviving a zone failure.' },
            { id: 'd', text: 'Consolidated billing', explanation: 'Consolidated billing is an AWS Organizations cost feature and is unrelated to availability.' },
          ],
          correct: ['b'],
        },
        {
          id: 'm01-value-of-aws-cloud-p3',
          type: 'multi',
          domain: 1,
          taskStatement: '1.1',
          difficulty: 'medium',
          stem: 'Which TWO statements describe benefits of the AWS global infrastructure? (Select TWO.)',
          options: [
            { id: 'a', text: 'Applications can be deployed close to customers in other geographies within minutes.', explanation: 'Correct. Being able to deploy into multiple Regions quickly is the “go global in minutes” benefit and lowers latency for distant users.' },
            { id: 'b', text: 'Workloads can be designed to survive the loss of a single data-centre location by using multiple Availability Zones.', explanation: 'Correct. Availability Zones are isolated locations within a Region, so multi-AZ designs raise availability.' },
            { id: 'c', text: 'AWS automatically replicates every customer workload to all Regions.', explanation: 'Incorrect. AWS does not replicate your workloads across Regions automatically; you choose where to deploy and replicate.' },
            { id: 'd', text: 'Customers must buy and install hardware in each new Region.', explanation: 'Incorrect. Removing the need to buy and install hardware is exactly what the cloud provides.' },
            { id: 'e', text: 'Using multiple Regions removes all customer security responsibilities.', explanation: 'Incorrect. Under the shared responsibility model the customer remains responsible for security in the cloud regardless of Region.' },
          ],
          correct: ['a', 'b'],
        },
      ],
};
