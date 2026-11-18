import type { Track } from '../types';

export const financialAccounting: Track = {
  id: 'fin-acct',
  area: 'finance',
  title: 'Financial Accounting',
  tagline: 'Read the three statements like an investor.',
  inspiredBy: 'HBS Financial Reporting & Control · MIT Sloan Financial Accounting',
  units: [
    {
      id: 'fa-u1',
      title: 'The Three Statements',
      description: 'Income statement, balance sheet, cash flow, and how they connect.',
      lessons: [
        // ------------------------------------------------------------------
        {
          id: 'fa-1-1',
          title: 'The income statement',
          summary: 'Profit, layer by layer, and the margins that matter.',
          keyTerms: [
            { term: 'Gross margin', definition: '(Revenue − Cost of goods sold) ÷ Revenue. How much of each sales dollar is left after the direct cost of the product.' },
            { term: 'Operating income (EBIT)', definition: 'Gross profit minus operating expenses (SG&A, R&D). Profit from the core business before interest and taxes.' },
            { term: 'Net margin', definition: 'Net income ÷ Revenue. The share of each sales dollar that reaches the bottom line.' },
          ],
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: 'Profit, layer by layer',
              body:
                'The income statement covers a **period of time** (a quarter or a year) and peels costs off revenue in layers:\n\n' +
                '- **Revenue** − **Cost of goods sold (COGS)** = **Gross profit**\n' +
                '- Gross profit − **Operating expenses** (SG&A, R&D) = **Operating income (EBIT)**\n' +
                '- EBIT − **Interest** − **Taxes** = **Net income**\n\n' +
                'Divide any line by revenue to get a **margin**. Margins let you compare companies of different sizes.',
              example:
                'A coffee chain: revenue $1,000k, COGS $400k → gross profit $600k (**60%** gross margin). Operating expenses $450k → EBIT $150k (**15%**). Interest $20k and taxes $30k → net income $100k (**10%** net margin).',
            },
            {
              kind: 'numeric',
              id: 'q1',
              prompt: 'Revenue is $500k and COGS is $300k. What is the **gross margin**?',
              answer: 40,
              unit: '%',
              hint: 'Gross profit ÷ revenue.',
              explanation: 'Gross profit = $500k − $300k = $200k. $200k ÷ $500k = **40%**.',
            },
            {
              kind: 'mcq',
              id: 'q2',
              prompt: 'For a furniture maker, which cost belongs in **COGS**?',
              choices: ['Wood and factory workers’ wages', 'The CEO’s salary', 'A TV advertising campaign', 'Interest on a bank loan'],
              answer: 0,
              explanation:
                'COGS holds costs directly tied to making the product: materials and production labor. The CEO’s salary and advertising are operating expenses (SG&A); interest sits below operating income.',
            },
            {
              kind: 'numeric',
              id: 'q3',
              prompt: 'Revenue $2.0M, gross profit $1.2M, SG&A $0.5M, R&D $0.3M. What is **operating income**, in $M?',
              answer: 0.4,
              unit: '$M',
              tolerance: 0.001,
              explanation: 'EBIT = gross profit − operating expenses = $1.2M − $0.5M − $0.3M = **$0.4M** (a 20% operating margin).',
            },
            {
              kind: 'tf',
              id: 'q4',
              statement: 'A company with a high gross margin must also have a high net margin.',
              answer: false,
              explanation:
                'Many software companies have 75%+ gross margins but lose money, because sales, marketing and R&D eat the gross profit. Gross margin tells you about the product; net margin tells you about the whole business.',
            },
            {
              kind: 'match',
              id: 'q5',
              prompt: 'Match each line item to what it means.',
              pairs: [
                ['COGS', 'Direct cost of the goods sold'],
                ['SG&A', 'Selling, general & administrative costs'],
                ['EBIT', 'Profit before interest and taxes'],
                ['Net income', 'Profit after every expense'],
              ],
            },
            {
              kind: 'mcq',
              id: 'q6',
              prompt: 'You want to compare the **core operating profitability** of two retailers. One has no debt; the other is heavily indebted. Which metric is fairest?',
              choices: ['Operating margin', 'Net margin', 'Revenue growth', 'Gross profit in dollars'],
              answer: 0,
              explanation:
                'Operating margin is measured **before interest**, so it isn’t distorted by how each company is financed. Net margin would penalize the indebted retailer for its interest bill.',
            },
          ],
        },
        // ------------------------------------------------------------------
        {
          id: 'fa-1-2',
          title: 'The balance sheet',
          summary: 'A snapshot of what a company owns, owes, and what’s left for owners.',
          keyTerms: [
            { term: 'Accounting equation', definition: 'Assets = Liabilities + Equity. Every transaction keeps both sides equal.' },
            { term: 'Current ratio', definition: 'Current assets ÷ current liabilities. A quick test of whether short-term obligations can be met.' },
            { term: 'Retained earnings', definition: 'Cumulative net income kept in the business (not paid out as dividends). A claim on assets, not a pile of cash.' },
          ],
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: 'Owns = owes + owners',
              body:
                'The balance sheet is a **snapshot at one moment**, not a period. It always balances:\n\n' +
                '**Assets = Liabilities + Equity**\n\n' +
                '- **Assets**: resources the company controls that produce future benefit: cash, receivables, inventory, equipment (PP&E).\n' +
                '- **Liabilities**: what it owes: supplier bills (payables), loans, bonds.\n' +
                '- **Equity**: the owners’ residual claim: money invested plus **retained earnings**.\n\n' +
                '“**Current**” means expected to turn into cash, or be paid, within a year.',
              example:
                'Founders invest $100k and the startup borrows $50k. It spends $30k on equipment. Assets: cash $120k + equipment $30k = **$150k**. Liabilities $50k + equity $100k = **$150k**. Balanced.',
            },
            {
              kind: 'numeric',
              id: 'q1',
              prompt: 'Total assets are $800k and total liabilities are $500k. What is **equity**, in $k?',
              answer: 300,
              unit: '$k',
              explanation: 'Equity = assets − liabilities = $800k − $500k = **$300k**.',
            },
            {
              kind: 'mcq',
              id: 'q2',
              prompt: 'A shop buys $10k of inventory **on credit** (it will pay the supplier in 30 days). What happens on the balance sheet today?',
              choices: [
                'Inventory +$10k and accounts payable +$10k',
                'Cash −$10k and inventory +$10k',
                'Inventory +$10k and equity +$10k',
                'Nothing until the supplier is paid',
              ],
              answer: 0,
              explanation:
                'The shop gains an asset (inventory) and an obligation (accounts payable) at the same moment. Cash only moves in 30 days, when the payable is settled.',
            },
            {
              kind: 'order',
              id: 'q3',
              prompt: 'Order these current assets from **most to least liquid**, the way they appear on a balance sheet.',
              items: ['Cash', 'Marketable securities', 'Accounts receivable', 'Inventory'],
              explanation:
                'Cash is already cash. Securities can be sold in days. Receivables wait on customers to pay. Inventory must first be **sold** and then collected.',
            },
            {
              kind: 'tf',
              id: 'q4',
              statement: 'Retained earnings is a pile of cash the company has saved up.',
              answer: false,
              explanation:
                'Retained earnings is the running total of profits kept in the business. Those profits may have been spent long ago on inventory, factories or acquisitions. It’s a source of funding on the right side, not an asset.',
            },
            {
              kind: 'mcq',
              id: 'q5',
              prompt: 'Which of these is a **current liability**?',
              choices: ['Accounts payable', 'A 10-year bond', 'Common stock', 'Equipment'],
              answer: 0,
              explanation:
                'Supplier bills are typically due within weeks. A 10-year bond is long-term (except the slice due this year), common stock is equity, and equipment is an asset.',
            },
            {
              kind: 'numeric',
              id: 'q6',
              prompt: 'Current assets are $600k and current liabilities are $400k. What is the **current ratio**?',
              answer: 1.5,
              unit: 'x',
              tolerance: 0.01,
              explanation: '$600k ÷ $400k = **1.5x**. The company has $1.50 of short-term assets for every $1 due within a year.',
            },
          ],
        },
        // ------------------------------------------------------------------
        {
          id: 'fa-1-3',
          title: 'Accrual accounting',
          summary: 'Why revenue isn’t cash, and how that can be abused.',
          keyTerms: [
            { term: 'Accrual basis', definition: 'Record revenue when it’s earned and expenses when they’re incurred, regardless of when cash moves.' },
            { term: 'Deferred revenue', definition: 'Cash collected for goods or services not yet delivered. A liability until earned.' },
            { term: 'Matching principle', definition: 'Expenses are recorded in the same period as the revenue they helped produce.' },
          ],
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: 'Earned, not received',
              body:
                'Under **accrual accounting**, revenue is recorded when it’s **earned**: when control of the goods or service passes to the customer. Expenses are **matched** to the revenue they helped generate. When cash actually moves is a separate question.\n\n' +
                'The gap between the two creates four balance-sheet accounts:\n\n' +
                '- **Accounts receivable**: earned, not yet collected\n' +
                '- **Deferred revenue**: collected, not yet earned\n' +
                '- **Accrued expenses**: incurred, not yet paid\n' +
                '- **Prepaid expenses**: paid, not yet used',
              example:
                'A customer pays $1,200 on January 1 for a 12-month software subscription. Cash rises by $1,200 in January, but revenue is **$100 a month**. On January 31, $1,100 still sits in deferred revenue, a liability, because the company owes 11 more months of service.',
            },
            {
              kind: 'mcq',
              id: 'q1',
              prompt: 'A consultancy finishes a project in **December**, invoices $50k, and the client pays in **February**. When is the revenue recorded?',
              choices: ['December', 'February', 'Half in each month', 'When the invoice is sent, if that’s in January'],
              answer: 0,
              explanation:
                'The work was delivered in December, so the revenue was earned then. December’s balance sheet shows a $50k receivable; February’s payment just converts it to cash.',
            },
            {
              kind: 'numeric',
              id: 'q2',
              prompt:
                'On **October 1** a customer prepays $2,400 for a 12-month subscription. The fiscal year ends **December 31**. How much revenue is recognized this fiscal year, in $?',
              answer: 600,
              unit: '$',
              hint: 'How many of the 12 months fall before year-end?',
              explanation: '$2,400 ÷ 12 = $200 a month. October, November and December = 3 months = **$600**.',
            },
            {
              kind: 'numeric',
              id: 'q3',
              prompt: 'Same subscription: how much **deferred revenue** is on the balance sheet at December 31, in $?',
              answer: 1800,
              unit: '$',
              explanation: 'Collected $2,400, earned $600, so **$1,800** is still owed to the customer as 9 months of service.',
            },
            {
              kind: 'match',
              id: 'q4',
              prompt: 'Match each account to the timing gap it captures.',
              pairs: [
                ['Accounts receivable', 'Earned, not yet collected'],
                ['Deferred revenue', 'Collected, not yet earned'],
                ['Accrued expense', 'Incurred, not yet paid'],
                ['Prepaid expense', 'Paid, not yet used'],
              ],
            },
            {
              kind: 'tf',
              id: 'q5',
              statement: 'Depreciation is a cash expense.',
              answer: false,
              explanation:
                'The cash left when the equipment was bought. Depreciation spreads that cost over the years the equipment is used, which is the matching principle at work. No cash moves when it’s recorded.',
            },
            {
              kind: 'case',
              id: 'case',
              title: 'The year-end push',
              role: 'You are the CFO of a mid-sized industrial equipment maker.',
              scenario:
                'It’s December 20. The company will miss its annual revenue target by $2M, and the stock has been rewarded for “beat and raise” quarters.\n\n' +
                'Your head of sales has a fix: ship $2M of equipment to distributors before December 31. Distributors would accept it only if they can **return anything unsold by March**, and they would pay nothing until they resell it.',
              question: 'How do you handle the $2M?',
              options: [
                {
                  text: 'Ship it and book the full $2M as revenue this year.',
                  quality: 'poor',
                  feedback:
                    'With an open right of return and payment contingent on resale, the distributors haven’t really taken control of the goods. Auditors are likely to challenge this, and if returns come back you face a restatement, which investors punish far more than a miss.',
                },
                {
                  text: 'Ship it, but record revenue only for the amount you can reliably expect won’t be returned, with a returns reserve and clear disclosure.',
                  quality: 'ok',
                  feedback:
                    'This is closer to the rules: revenue is recognized only to the extent a reversal is unlikely. But with payment contingent on resale you may be able to book very little, and you’re still pulling Q1 demand into Q4, which makes next year’s target harder. Technically defensible, strategically weak.',
                },
                {
                  text: 'Don’t ship. Report the miss, explain the pipeline, and book revenue when it’s earned.',
                  quality: 'best',
                  feedback:
                    'Protecting earnings quality protects your credibility. A clean miss with a credible explanation usually costs less than the discount markets apply once they suspect managed numbers.',
                },
              ],
              debrief:
                'Under the current revenue standards (ASC 606 / IFRS 15), revenue is recognized when **control transfers**, and only to the extent it’s **unlikely to reverse**. “Channel stuffing” borrows revenue from the future, and the receivables and returns usually give it away.\n\n' +
                '**Takeaway:** when you read a company’s results, check whether receivables are growing much faster than revenue. That’s a classic warning sign.',
            },
          ],
        },
        // ------------------------------------------------------------------
        {
          id: 'fa-1-4',
          title: 'The cash flow statement',
          summary: 'Following the cash: operating, investing, financing.',
          keyTerms: [
            { term: 'Cash from operations (CFO)', definition: 'Cash generated by the core business: net income adjusted for non-cash items and changes in working capital.' },
            { term: 'Free cash flow', definition: 'Cash from operations minus capital expenditures. Cash available to repay debt or return to owners.' },
            { term: 'Working capital', definition: 'Current operating assets (receivables, inventory) minus current operating liabilities (payables). Growth in it absorbs cash.' },
          ],
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: 'Three buckets of cash',
              body:
                'The cash flow statement explains why cash changed over the period, in three sections:\n\n' +
                '- **Operating (CFO)**: cash from running the business\n' +
                '- **Investing (CFI)**: buying or selling long-term assets (capex, acquisitions)\n' +
                '- **Financing (CFF)**: raising or repaying debt and equity, paying dividends, buying back stock\n\n' +
                'Most companies build CFO with the **indirect method**: start with net income, add back non-cash expenses like depreciation, then adjust for working capital.',
              example:
                'If receivables **rise**, you recorded sales but haven’t collected the cash, so you **subtract** the increase. If payables **rise**, you’ve recorded costs you haven’t paid yet, so you **add** the increase.',
            },
            {
              kind: 'mcq',
              id: 'q1',
              prompt: 'A company spends $5M building a new warehouse. Where does that appear?',
              choices: ['Investing activities', 'Operating activities', 'Financing activities', 'It doesn’t; it’s on the balance sheet only'],
              answer: 0,
              explanation: 'Buying long-term assets is **capital expenditure**, which sits in investing activities. It shows up on the income statement only gradually, as depreciation.',
            },
            {
              kind: 'mcq',
              id: 'q2',
              prompt: 'Paying a **dividend** to shareholders appears in…',
              choices: ['Financing activities', 'Operating activities', 'Investing activities', 'The income statement, as an expense'],
              answer: 0,
              explanation: 'Dividends are a return of capital to owners, which is a financing flow. They are **not** an expense, so they never touch net income.',
            },
            {
              kind: 'numeric',
              id: 'q3',
              prompt:
                'Net income $100k. Depreciation $20k. Accounts receivable **increased** $30k. Accounts payable **increased** $10k. What is **cash from operations**, in $k?',
              answer: 100,
              unit: '$k',
              hint: 'Start with net income, add back depreciation, then adjust for each working-capital change.',
              explanation: '$100k + $20k (non-cash) − $30k (cash tied up in receivables) + $10k (bills not yet paid) = **$100k**.',
            },
            {
              kind: 'tf',
              id: 'q4',
              statement: 'If accounts receivable rises, cash from operations will be higher than net income, all else equal.',
              answer: false,
              explanation: 'A rise in receivables means sales were booked but not collected, so cash from operations comes in **below** net income.',
            },
            {
              kind: 'numeric',
              id: 'q5',
              prompt: 'Cash from operations is $500k and capital expenditures are $200k. What is **free cash flow**, in $k?',
              answer: 300,
              unit: '$k',
              explanation: 'FCF = CFO − capex = $500k − $200k = **$300k**. That’s the cash left over to repay debt, pay dividends, or reinvest.',
            },
            {
              kind: 'order',
              id: 'q6',
              prompt: 'Put the steps of the **indirect method** in order.',
              items: [
                'Start with net income',
                'Add back depreciation & amortization',
                'Adjust for changes in working capital',
                'Arrive at cash from operations',
              ],
              explanation: 'Profit first, then undo non-cash charges, then account for cash tied up in (or released from) receivables, inventory and payables.',
            },
          ],
        },
        // ------------------------------------------------------------------
        {
          id: 'fa-1-5',
          title: 'How it all connects',
          summary: 'Tie the three statements together, and see how profitable firms go broke.',
          keyTerms: [
            { term: 'Retained earnings roll-forward', definition: 'Ending retained earnings = beginning retained earnings + net income − dividends.' },
            { term: 'Cash conversion cycle', definition: 'Days inventory + days receivables − days payables. How long cash is tied up in operations.' },
            { term: 'Depreciation tax shield', definition: 'Depreciation lowers taxable income, so it saves cash equal to depreciation × tax rate, even though it’s non-cash itself.' },
          ],
          steps: [
            {
              kind: 'concept',
              id: 'c1',
              title: 'Three views of one business',
              body:
                'The statements are linked:\n\n' +
                '- **Net income** (income statement) flows into **retained earnings** (balance sheet), less any dividends.\n' +
                '- **Ending cash** on the cash flow statement equals **cash** on the balance sheet.\n' +
                '- Changes in balance-sheet accounts (receivables, inventory, debt) explain the cash flow statement.\n\n' +
                '**Depreciation** touches all three: it’s an expense on the income statement, it reduces PP&E on the balance sheet, and it’s added back on the cash flow statement.',
              example:
                'Depreciation rises by $10 and the tax rate is 25%. Pre-tax income falls $10, taxes fall $2.50, so net income falls **$7.50**. Cash from operations: −$7.50 net income + $10 add-back = **+$2.50**. The company saved $2.50 of tax.',
            },
            {
              kind: 'numeric',
              id: 'q1',
              prompt: 'Beginning retained earnings $400k. Net income $120k. Dividends paid $20k. What are **ending retained earnings**, in $k?',
              answer: 500,
              unit: '$k',
              explanation: '$400k + $120k − $20k = **$500k**.',
            },
            {
              kind: 'numeric',
              id: 'q2',
              prompt: 'Depreciation increases by $20 and the tax rate is 25%. By how much does **net income fall**, in $?',
              answer: 15,
              unit: '$',
              hint: 'Depreciation lowers taxes too.',
              explanation: 'Pre-tax income falls $20; taxes fall 25% × $20 = $5. Net income falls **$15**.',
            },
            {
              kind: 'mcq',
              id: 'q3',
              prompt: 'Same situation: depreciation up $20, 25% tax rate. What happens to **cash**?',
              choices: ['It rises by $5', 'It falls by $15', 'It falls by $20', 'No change'],
              answer: 0,
              explanation:
                'Net income falls $15, but the $20 of depreciation is added back on the cash flow statement: −$15 + $20 = **+$5**, the tax saved.',
            },
            {
              kind: 'tf',
              id: 'q4',
              statement: 'A company can report a profit every year and still run out of cash.',
              answer: true,
              explanation:
                'If customers pay slowly, inventory builds, or capex is heavy, cash can drain even while profits grow. Many fast-growing companies have failed this way.',
            },
            {
              kind: 'case',
              id: 'case',
              title: 'Growing broke',
              role: 'You are the founder-CEO of a fast-growing specialty food distributor.',
              scenario:
                'Sales are up 60% this year and you’re solidly profitable. Yet your bank balance is close to zero, and next month’s payroll is tight.\n\n' +
                'Looking closer: large grocery chains pay you in **75 days** on average. You pay your suppliers in **30 days**. To keep up with growth you’ve been stocking more inventory, and it now sits for about **45 days** before it sells.',
              question: 'What’s your first move?',
              options: [
                {
                  text: 'Raise prices 10% to boost margins.',
                  quality: 'ok',
                  feedback:
                    'Higher margins help eventually, but they don’t solve the timing problem: you’d still wait 75 days to collect each sale. Price increases also risk the growth that’s driving the business.',
                },
                {
                  text: 'Shorten the cash conversion cycle: offer early-payment discounts, negotiate longer supplier terms, clear slow-moving stock, and set up a working-capital credit line.',
                  quality: 'best',
                  feedback:
                    'This fixes the real problem. Your cycle is 45 + 75 − 30 = **90 days**: every extra dollar of sales ties up cash for three months. Each day you cut frees cash, and the credit line covers the gap while you work on the rest.',
                },
                {
                  text: 'Cut the marketing budget to increase profit.',
                  quality: 'poor',
                  feedback:
                    'Profit isn’t the problem; you’re already profitable. Cutting marketing could slow growth without touching the 90 days your cash is stuck in receivables and inventory.',
                },
              ],
              debrief:
                '**Cash conversion cycle = days inventory + days receivables − days payables.** Growth consumes working capital: the faster you grow, the more cash gets tied up, even at healthy margins.\n\n' +
                '**Takeaway:** for any growing business, check the cash flow statement next to the income statement. Profit is an opinion; cash is a fact.',
            },
          ],
        },
      ],
    },
    { id: 'fa-u2', title: 'Analyzing Performance', description: 'Ratio analysis, DuPont ROE, and benchmarking against peers.', lessons: [] },
    { id: 'fa-u3', title: 'Working Capital & Inventory', description: 'Receivables, inventory methods, and the cash conversion cycle.', lessons: [] },
    { id: 'fa-u4', title: 'Long-Term Assets & Liabilities', description: 'Capex, depreciation, leases, and debt.', lessons: [] },
    { id: 'fa-u5', title: 'Earnings Quality', description: 'Red flags, non-GAAP metrics, and reading the footnotes.', lessons: [] },
    { id: 'fa-u6', title: 'Managerial Accounting', description: 'Cost behavior, contribution margin, and break-even.', lessons: [] },
  ],
};
