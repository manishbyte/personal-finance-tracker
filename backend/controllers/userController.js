const User = require('../models/User');
const Transaction =require('../models/Transaction')
const Budget =require('../models/Budget')

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
 
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }

    await user.save(); 

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.userTransaction =async(req,res)=>{
  const { date, description, amount } = req.body;
  const userId = req.user.id
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const transaction = new Transaction({ date, description, amount, userId: userId });
    await transaction.save();

    user.transactions.push(transaction._id);
    await user.save();

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error adding transaction:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

exports.allTransaction =async(req,res)=>{
  try {
    const userId =req.user.id
    const transactions = await Transaction.find({userId:userId})   
     
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching transactions" });
  }
}

exports.dateTransaction =async(req,res)=>{
  const { start, end } = req.query;

   const userId =req.user.id
   
  if (!start || !end) {
    return res.status(400).json({ error: "Start and end dates are required" });
  }

  try {
    const transactions = await Transaction.find({
      userId: userId,
      date: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
    })
    
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

exports.setBudget =async(req,res)=>{
  const { amount, startDate, endDate } = req.body;
  const userId = req.user.id; 

  try {
    if (!amount || !startDate || !endDate) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: "Start date must be before end date." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    let existingBudget = await Budget.findOne({
      userId,
      startDate: { $lte: endDate }, 
      endDate: { $gte: startDate }, 
    });

    if (existingBudget) {
      existingBudget.amount = amount; 
      await existingBudget.save(); 

      user.budgets = user.budgets.map(budget => {
        if (new Date(budget.startDate).getTime() === new Date(startDate).getTime() && new Date(budget.endDate).getTime() === new Date(endDate).getTime()) {
          return { ...budget, amount }; 
        }
        return budget;
      });
      await user.save();

      return res.json({ message: "Budget updated successfully!", amount: existingBudget.amount });
    } else {
      const newBudget = new Budget({
        userId,
        amount,
        startDate,
        endDate,
      });
      await newBudget.save(); 

      
      user.budgets.push({
        amount,
        startDate,
        endDate,
      });
      await user.save(); 

      return res.json({ message: "Budget set successfully!", amount: newBudget.amount });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

exports.checkBudget =async(req,res)=>{
  const { startDate, endDate } = req.body;
  const userId = req.user.id; 

  try {
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start date and end date are required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const userBudget = user.budgets.find(budget => 
      new Date(budget.startDate).getTime() <= new Date(endDate).getTime() &&
      new Date(budget.endDate).getTime() >= new Date(startDate).getTime()
    );
      
    if (!userBudget) {
      return res.status(404).json({ error: "No budget found for the selected date range." });
    }

    const transactions = await Transaction.find({
      userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    const totalTransactionAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    if (totalTransactionAmount <= userBudget.amount) {
      return res.json({ 
        message: "Your budget is under control.",
        totalSpent: totalTransactionAmount,
        budget: userBudget.amount
      });
    } else {
      return res.json({
        message: "You have exceeded your budget!",
        totalSpent: totalTransactionAmount,
        budget: userBudget.amount
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { date, description, amount } = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { date, description, amount },
      { new: true, runValidators: true } 
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};

exports.userImage =async(req,res)=>{
  const { profilePicture } = req.body;
  const userId = req.user.id; 
  
   
   
  if (!profilePicture) {
    return res.status(400).json({ message: 'Profile picture URL is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = profilePicture;
    await user.save();

    res.status(200).json({ profilePicture: user.profilePicture });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}