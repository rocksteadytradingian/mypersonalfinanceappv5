-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- User Profiles policies
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Transactions policies
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
    ON transactions FOR DELETE
    USING (auth.uid() = user_id);

-- Budgets policies
CREATE POLICY "Users can view own budgets"
    ON budgets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own budgets"
    ON budgets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
    ON budgets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
    ON budgets FOR DELETE
    USING (auth.uid() = user_id);

-- Fund Sources policies
CREATE POLICY "Users can view own fund sources"
    ON fund_sources FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own fund sources"
    ON fund_sources FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fund sources"
    ON fund_sources FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fund sources"
    ON fund_sources FOR DELETE
    USING (auth.uid() = user_id);

-- Credit Cards policies
CREATE POLICY "Users can view own credit cards"
    ON credit_cards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own credit cards"
    ON credit_cards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credit cards"
    ON credit_cards FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own credit cards"
    ON credit_cards FOR DELETE
    USING (auth.uid() = user_id);

-- Investments policies
CREATE POLICY "Users can view own investments"
    ON investments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own investments"
    ON investments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments"
    ON investments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own investments"
    ON investments FOR DELETE
    USING (auth.uid() = user_id);

-- Loans policies
CREATE POLICY "Users can view own loans"
    ON loans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own loans"
    ON loans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loans"
    ON loans FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own loans"
    ON loans FOR DELETE
    USING (auth.uid() = user_id);