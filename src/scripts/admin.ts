import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createInterface } from 'readline';
import connectDB from '../lib/mongodb';
import User from '../models/User';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    while (true) {
      console.log('\nAdmin Menu:');
      console.log('1. Create new user');
      console.log('2. List all users');
      console.log('3. Remove user');
      console.log('4. Change password');
      console.log('5. Exit');
      
      const choice = await question('Enter your choice (1-5): ');

      switch (choice) {
        case '1':
          await createUser();
          break;
        case '2':
          await listUsers();
          break;
        case '3':
          await removeUser();
          break;
        case '4':
          await changePassword();
          break;
        case '5':
          console.log('Goodbye!');
          process.exit(0);
        default:
          console.log('Invalid choice. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

async function createUser() {
  const username = await question('Enter username: ');
  const password = await question('Enter password: ');

  try {
    const user = new User({ username, password });
    await user.save();
    console.log('User created successfully!');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error creating user:', errorMessage);
  }
}

async function listUsers() {
  try {
    const users = await User.find({}, '-password');
    console.log('\nUsers:');
    users.forEach(user => {
      console.log(`Username: ${user.username}, Created: ${user.createdAt}`);
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error listing users:', errorMessage);
  }
}

async function removeUser() {
  const username = await question('Enter username to remove: ');
  
  try {
    const result = await User.deleteOne({ username });
    if (result.deletedCount === 0) {
      console.log('User not found!');
    } else {
      console.log('User removed successfully!');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error removing user:', errorMessage);
  }
}

async function changePassword() {
  const username = await question('Enter username: ');
  const newPassword = await question('Enter new password: ');
  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found!');
      return;
    }
    
    user.password = newPassword;
    await user.save();
    console.log('Password changed successfully!');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error changing password:', errorMessage);
  }
}

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

main(); 