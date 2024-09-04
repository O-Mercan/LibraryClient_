# LibraryClient_

This project contains the client-side code for a library system running on the Solana blockchain. Users can borrow and return books using this application.

## About the Project

**LibraryClient** is designed to handle the client-side operations of a library system. Users can only use the `borrowBook` and `returnBook` functions, while an authority can manage the `addBook`, `removeBook`, `borrowBook`, and `returnBook` functions.

### Key Features

- **User Operations:**
  - Create a user account (`createNewUserAccount`)
  - Read user accounts (`readUserAccount`)
  - Borrow a book (`borrowBook`)
  - Return a book (`returnBook`)

- **Book Operations:**
  - Create a book (`createBook`)
  - Read book accounts (`readBookAccount`)
  - Add a book (`addBook`)
  - Remove a book (`removeBook`)

- **Other:**
  - Initialize counters (`initializeCounter`)
  - Configuration (`configuration`)
  - Check authority (`checkAuthority`)

## Installation

### Prerequisites

- Node.js (v16 and above)
- NPM or Yarn
- Solana CLI
- Rust and Cargo

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/LibraryClient.git
   cd LibraryClient
