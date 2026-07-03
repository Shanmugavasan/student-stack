import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

// Configure with your target AWS Region
const client = new DynamoDBClient({ region: "eu-north-1" });
const docClient = DynamoDBDocumentClient.from(client);

const articles = [
  {
    id: "visa-sponsorship-2026",
    status: "PUBLISHED",
    createdAt: "2026-03-25T10:00:00.000Z",
    title: "Top UK Companies Sponsoring Visas for AI & Data Science Grads in 2026",
    category: "Careers",
    excerpt: "As we move into the 2026 graduate recruitment cycle, the landscape for international students in the UK has shifted. While salary thresholds have tightened, the demand for STEM talent remains high.",
    author_name: "StudentStack Editorial",
    author_id: "system-studentstack-editorial", // Added master account tracking ID
    isVerified: true,
    readTime: "8 min read",
    likes: 0,
    content: `As we move into the 2026 graduate recruitment cycle, the landscape for international students in the UK has shifted. While salary thresholds have tightened, the demand for STEM talent—specifically in Artificial Intelligence—remains at an all-time high.

Following the 2025 Immigration Updates, the "Skilled Worker" route remains the primary path for students transitioning from a Tier 4 (Student) visa. For AI and Data Science graduates, the good news is that these roles often fall under high-growth categories, making the sponsorship process smoother for large-scale employers.

### 1. Lloyds Banking Group: The Data Powerhouse
Lloyds has significantly expanded its 2026 Graduate Data Science scheme. Headquartered in London and Bristol, they are actively looking for specialists in Generative AI (GenAI) and MLOps.
* **Visa Policy:** Historically a reliable sponsor for Graduate roles.
* **Key Skills:** Python, SQL, and experience with Large Language Models (LLMs).

### 2. Mistral AI (UK Operations)
With their expanded presence in London's "AI Quarter," Mistral is hiring for Deployment Strategist roles. These positions bridge the gap between technical engineering and client implementation.
Mistral has shown a strong preference for international talent with high-level NLP (Natural Language Processing) experience, often assisting with the transition from Student to Skilled Worker visas for exceptional candidates.

### 3. Deloitte & The "Big Four"
Deloitte's "AI & Data" rotation remains one of the largest sponsors in the UK. Their 2026 intake is focused on Algorithmic Ethics and IT Audit. Because of their scale, they have a dedicated immigration team to handle the Certificate of Sponsorship (CoS) process.

💡 **Pro Tip for International Applicants:** Before applying, always cross-reference the company name against the "Register of Licensed Sponsors" on the UK Gov website. Even if a job description doesn't mention sponsorship, being on this list means they have the legal authority to hire you.

### Conclusion
Securing a visa in 2026 requires more than just technical skill; it requires a strategic approach to finding employers who already have the infrastructure to sponsor. Use tools like the StudentStack Job Search to filter for companies known for their international hiring practices.`
  },
  {
    id: "dropshipping-visa",
    status: "PUBLISHED",
    createdAt: "2026-04-02T14:30:00.000Z",
    title: "Can You Start a Dropshipping Business on a UK Student Visa? (2026 Update)",
    category: "Legal",
    excerpt: "The Home Office strictly prohibits self-employment and 'Business Activity.' Here is why managing a Shopify store could risk your visa status under the 2026 guidelines.",
    author_name: "StudentStack Editorial",
    author_id: "system-studentstack-editorial", // Added master account tracking ID
    isVerified: true,
    readTime: "5 min read",
    likes: 0,
    content: `With the rise of e-commerce and Shopify automation, many international students in the UK look toward dropshipping as a flexible way to earn money while studying. However, under the 2026 Home Office (UKVI) guidelines, this is a dangerous legal minefield.

### 1. The "Business Activity" Clause
Most Student Route visas allow for 10 or 20 hours of work per week during term time. However, there is a strict prohibition on Self-Employment and Business Activity.
⚠️ *"Business Activity" is defined by the UKVI as being a director of a company, or engaging in any activity as a self-employed person, including selling goods or services online.*

### 2. Does Selling to the US/India Make it Legal?
A common myth is that if your customers are in the US or India, and you are using a non-UK bank account, you aren't "working in the UK."
**This is false.** The Home Office looks at where you are physically located when you perform the work. If you are sitting in a library in Norwich or a flat in London while managing your Shopify store, you are working in the UK.

### 3. The Consequences of a Breach
Breaching your visa conditions can lead to immediate and severe consequences:
* **Visa Curtailment:** Having your current visa cancelled immediately.
* **Future Bans:** Difficulty returning to the UK or switching to the Graduate Visa (PSW).
* **Academic Impact:** Universities are required to report suspicious activity to the Home Office.

### Conclusion: Play it Safe
Focus on building your skills in 2026. If you want to start a business, the legal path is to wait until you switch to the Graduate Visa, which permits self-employment and entrepreneurship.`
  },
  {
    id: "monzo-vs-revolut",
    status: "PUBLISHED",
    createdAt: "2026-04-15T09:15:00.000Z",
    title: "Monzo vs Revolut: Which is actually better for UK Students in 2026?",
    category: "Finance",
    excerpt: "Choosing your first UK 'Challenger Bank' as an international student. A breakdown of hidden fees, split bills, and protection rules.",
    author_name: "StudentStack Editorial",
    author_id: "system-studentstack-editorial", // Added master account tracking ID
    isVerified: true,
    readTime: "4 min read",
    likes: 0,
    content: `Arriving in the UK as a student often means your first priority is a bank account. High-street banks (Barclays, HSBC) can take weeks to verify your student status. That's why Monzo and Revolut are the go-to choices. But which one should you choose?

### 1. The "Real Bank" Factor (FSCS Protection)
In 2026, both are now major players, but there is a key legal difference:
* **Monzo:** A fully licensed UK bank. Your money (up to £85,000) is protected by the FSCS. It’s the safe bet for your main maintenance loan or allowances.
* **Revolut:** While they received their UK banking license recently, they are still mobilising features. It’s perfect for fast daily spending, but some students still prefer Monzo for their primary bank destination.

### 2. International Transfers & Currency
If you are receiving money from home (USD, EUR, INR), Revolut wins. They allow you to hold 30+ currencies and offer much better interbank exchange rates. Monzo uses Wise for transfers, which is good, but Revolut’s built-in currency exchange is faster and often cheaper for arriving students.

### 3. Splitting Bills & Social Features
If your friends are in the UK, they probably have Monzo. "Monzoing" someone money has become a local verb. Their Shared Tabs feature for housemates is incredible for splitting rent or grocery bills without any awkward math.

### 🏆 The Verdict
* **Use Monzo for:** Your Student Loan, paying rent, and splitting bills with UK friends.
* **Use Revolut for:** Traveling to Europe on break, receiving money from overseas, and casual daily spending.`
  }
];

async function seed() {
  console.log("🌱 Uploading Master Guides with secure metadata layout...");
  try {
    for (const article of articles) {
      await docClient.send(new PutCommand({
        TableName: "StudentStack-Blogs",
        Item: article
      }));
      console.log(`✅ Seeded: ${article.title}`);
    }
    console.log("🚀 Complete! All master articles live in DynamoDB with exact relations.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

async function clear() {
  console.log("🗑️  Scanning for existing blogs to delete...");
  try {
    const { Items } = await docClient.send(new ScanCommand({
      TableName: "StudentStack-Blogs"
    }));

    if (!Items || Items.length === 0) {
      console.log("🤷 No blogs found. Table is already empty.");
      return;
    }

    for (const item of Items) {
      await docClient.send(new DeleteCommand({
        TableName: "StudentStack-Blogs",
        Key: {
          status: item.status,
          createdAt: item.createdAt
        }
      }));
      console.log(`💥 Deleted: ${item.title}`);
    }
    console.log("🧹 Complete! Database table cleared.");
  } catch (error) {
    console.error("❌ Clear failed:", error);
  }
}

const action = process.argv[2];

if (action === 'seed') {
  seed();
} else if (action === 'clear') {
  clear();
} else {
  console.log("⚠️  Please specify an action. Usage: node src/seedMasterGuides.js [seed|clear]");
}