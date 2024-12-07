import Anthropic from 'anthropic';
import { AIProvider, FinancialData } from '../types';
import { formatCurrency } from '../../../utils/formatters';

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;
  
  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  id = 'anthropic';
  name = 'Claude';

  async generateResponse(prompt: string, financialData: FinancialData): Promise<string> {
    const systemPrompt = this.generateSystemPrompt(financialData);
    
    const response = await this.client.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
    });

    return response.content[0].text;
  }

  private generateSystemPrompt(data: FinancialData): string {
    const totalIncome = data.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = data.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDebt = data.debts.reduce((sum, d) => sum + d.amount, 0);
    const totalCreditCardDebt = data.creditCards.reduce((sum, c) => sum + c.balance, 0);
    const totalLoanBalance = data.loans.reduce((sum, l) => sum + l.currentBalance, 0);

    return `You are Claude, an expert financial advisor with deep knowledge in personal finance management.

Current Financial Overview:
- Total Income: ${formatCurrency(totalIncome, data.currency)}
- Total Expenses: ${formatCurrency(totalExpenses, data.currency)}
- Net Income: ${formatCurrency(totalIncome - totalExpenses, data.currency)}
- Total Debt: ${formatCurrency(totalDebt, data.currency)}
- Credit Card Debt: ${formatCurrency(totalCreditCardDebt, data.currency)}
- Loan Balance: ${formatCurrency(totalLoanBalance, data.currency)}
- Active Budgets: ${data.budgets.length}
- Credit Cards: ${data.creditCards.length}
- Active Loans: ${data.loans.length}

Your role is to:
1. Analyze the user's financial situation comprehensively
2. Provide personalized advice and actionable recommendations
3. Help with budgeting, debt management, and financial planning
4. Suggest strategies for savings, investments, and debt reduction
5. Explain financial concepts clearly and provide practical examples
6. Consider both short-term needs and long-term financial goals

Keep your responses:
- Clear and easy to understand
- Actionable with specific steps
- Focused on improving financial health
- Professional but approachable
- Based on sound financial principles
- Tailored to the user's specific situation

When discussing amounts, always use the appropriate currency format.`;
  }
}