import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction
} from "@solana/web3.js";
import * as borsh from 'borsh';
import {User, UserSchema, Book, BookSchema, Counter, CounterSchema, BookNumber, BookNumberSchema} from "./model";


const connection = new Connection("https://api.testnet.solana.com", "confirmed");
const privateKeyPairArray = [91,183,59,199,210,13,74,177,232,53,17,5,186,32,1,149,236,87,241,209,12,208,19,252,62,74,190,139,110,234,131,224,94,99,10,41,127,234,93,14,177,106,216,236,127,23,190,88,211,61,237,136,38,39,66,102,106,88,77,244,215,149,53,124]
const payer = Keypair.fromSecretKey(Uint8Array.from(privateKeyPairArray))


const programId = new PublicKey("GF8CbezbWj2qr8x5B8WgsMQF5bGmMKxuwE9MrPT9DZca");
console.log("Program Id Public Key: ", programId.toBase58());
//const user = new PublicKey("");
//const book = new PublicKey("")


//create user
const createNewUserAccount = async () => {
    
    const readUserCounterKey = new PublicKey("2Fn83GsPpaQYnA68u5kic3WZYu98nBN2AyuQ2Eddx147")
    const counterAccountInfo = await connection.getAccountInfo(readUserCounterKey);

    const data =  borsh.deserialize( CounterSchema,Counter, counterAccountInfo?.data!);
    console.log(data)
    console.log("counter no: ",data.counter.toString());
    let user_number: bigint = BigInt(data.counter) + BigInt(1)
    console.log("user no:", user_number.toString());
  
    const user_account = PublicKey.findProgramAddressSync([Buffer.from("UA"), Buffer.from(user_number.toString())], programId)

    // Invoke program
    const ix = new TransactionInstruction({
        programId: programId, //transactionIx içindeki id hangi programı çağırıyor, Şu adrese gidecek
        keys: [
            { pubkey: user_account[0], isSigner: false, isWritable: true },
            { pubkey: payer.publicKey, isSigner: true, isWritable: true },
            { pubkey: readUserCounterKey, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],//  çağırdığımız programa gönderdiğmiz Ix e gönderdiğimiz account lar
        data: Buffer.from([0])// çağırdığımız programa gönderdiğimiz data
    });


    // Transactiona son block hash'ini ekleyip iki instruction ekliyoruz
    const blockHash = await connection.getLatestBlockhash()
    const message = new TransactionMessage({
        instructions: [ix],
        payerKey: payer.publicKey, //fee ödeyen (gönderme ücreti)
        recentBlockhash: blockHash.blockhash
    }).compileToV0Message()


    const tx = new VersionedTransaction(message)
    tx.sign([payer])

    // İşlemi gönderme ve imzayı konsola yazdırma
    const signature = await connection.sendTransaction(tx)
    console.log("Transaction signature:", signature)
}

//read user account
 const readUserAccount = async (user_number: string) => {
    const user_account = PublicKey.findProgramAddressSync([Buffer.from("UA"), Buffer.from(user_number)], programId)
    
    const accountInfo = await connection.getAccountInfo(user_account[0]);
    const data = borsh.deserialize(UserSchema, User, accountInfo?.data!);
    console.log("user adddress",data.user_address.toString())
    console.log("user book_no",data.book_no.toString())
    console.log("User user_no",data.user_no.toString())
    console.log("user borrowed at: ",data.borrowed_at.toString())
    console.log("user return by", data.return_by.toString())
    
}

// initialize_counter
const initializeCounter = async () => {
    //user and book counter infos
    const userCounterAccount = PublicKey.findProgramAddressSync([Buffer.from("UC")], programId)[0];
    console.log("usercounteraccount public key: ", userCounterAccount.toString());
    const BookCounterAccount = PublicKey.findProgramAddressSync([Buffer.from("BC")], programId)[0];
    console.log("book counter account s publickey: ", BookCounterAccount.toString());

    const ix = new TransactionInstruction({
        programId: programId,
        keys:[
            {pubkey: userCounterAccount, isSigner: false, isWritable:true},
            {pubkey: BookCounterAccount, isSigner: false, isWritable:true},
            {pubkey: payer.publicKey, isSigner: true, isWritable:true},
            {pubkey: SystemProgram.programId, isSigner: false, isWritable:false},
        ],
        data: Buffer.from([7])
    });

    //take recent blockhash
    const blockhHash = await connection.getLatestBlockhash();
    const message = new TransactionMessage({
        instructions: [ix],
        payerKey: payer.publicKey,
        recentBlockhash: blockhHash.blockhash
    }).compileToV0Message();
    
    //sign the transaction
    const tx = new VersionedTransaction(message);
    tx.sign([payer]);

    //send the transaction
    const signature = await connection.sendTransaction(tx);
    console.log("Transaction signature: ", signature);
}

const readCounter = async () => {

    const userCounterAccount = PublicKey.findProgramAddressSync([Buffer.from("UC")], programId)[0];
    console.log("usercounteraccount public key: ", userCounterAccount.toString());
    const BookCounterAccount = PublicKey.findProgramAddressSync([Buffer.from("BC")], programId)[0];
    console.log("book counter account s publickey: ", BookCounterAccount.toString());

    const bookCounterInfo = await connection.getAccountInfo(BookCounterAccount);
    const userCounterInfo = await connection.getAccountInfo(userCounterAccount);

    const bookCounter = borsh.deserialize(CounterSchema, Counter, bookCounterInfo!.data);
    const userCounter = borsh.deserialize(CounterSchema, Counter, userCounterInfo!.data);

    console.log("book counter: ", bookCounter.counter.toString());
    console.log("user counter: ", userCounter.counter.toString());

}

//create book
const createBook = async () => { 
    const readBookCounterKey = new PublicKey("7JrXkmr22CkAkkDHdrd4e2agrmAMGuCutQ6JAsx6gSSQ");
    const counterAccountInfo = await connection.getAccountInfo(readBookCounterKey);

    const data = borsh.deserialize(CounterSchema, Counter, counterAccountInfo?.data!);
    let book_number: bigint = BigInt(data.counter) + BigInt(1)
    console.log("createBook function, book number: ",book_number.toString());
    const book_account = PublicKey.findProgramAddressSync([Buffer.from("BC"), Buffer.from(book_number.toString())], programId)



    // invoke program
    const ix = new TransactionInstruction({
        programId: programId,
        keys: [
            { pubkey: book_account[0], isSigner: false, isWritable: true },
            { pubkey: payer.publicKey, isSigner: true, isWritable: true },
            { pubkey: readBookCounterKey, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
        ],
        data: Buffer.from([1])
    });

    // add the last block hash of the transaction and add instruction
    const blockHash = await connection.getLatestBlockhash();
    const message = new TransactionMessage({
        instructions: [ix],
        payerKey: payer.publicKey,
        recentBlockhash: blockHash.blockhash
    }).compileToV0Message();

    const tx = new VersionedTransaction(message);
    tx.sign([payer]);

    const signature = await connection.sendTransaction(tx);
    console.log("createBook Transaction signature:", signature);

}


//read book account
const readBookAccount = async (book_number: string) => {
    const book_account = PublicKey.findProgramAddressSync([Buffer.from("BC"), Buffer.from(book_number)], programId)
    
    const accountInfo = await connection.getAccountInfo(book_account[0]);
    const data = borsh.deserialize(BookSchema, Book, accountInfo?.data!);
    console.log("total number of books:",data.total_number_of_books.toString())
    console.log("book_no: ", data.book_no.toString())
    console.log("number_of_books", data.number_of_books.toString())
    console.log("in curculation: ", data.in_circulation.toString())
}

//addBook
const addBook = async (book_number: bigint, bookId: bigint) => {
    
    const book_pubkey = PublicKey.findProgramAddressSync([Buffer.from("BC"), Buffer.from(bookId.toString())], programId)

   let booknumber = new BookNumber()
   booknumber.book_number = book_number;
  

   let encoded = borsh.serialize(BookNumberSchema, booknumber);
   const concated = Uint8Array.of(2, ...encoded)

   const isntructionData = Buffer.from(concated);

   const ix = new TransactionInstruction({
    programId: programId,
    keys: [
        {pubkey: book_pubkey[0], isSigner: false, isWritable: true},
        {pubkey: payer.publicKey, isSigner: true, isWritable: true}
    ],
    data: isntructionData,
   });

    const blockHash = await connection.getLatestBlockhash();
    const message = new TransactionMessage({
        instructions: [ix],
        payerKey: payer.publicKey,
        recentBlockhash: blockHash.blockhash
    }).compileToV0Message();

    const tx = new VersionedTransaction(message);
    tx.sign([payer]);

    const signature = await connection.sendTransaction(tx)
    console.log("addBook transaction signature: ", signature);
};

//removeBook
const removeBook = async(book_number: bigint) => {
    const book_pubkey = PublicKey.findProgramAddressSync([Buffer.from("BC"), Buffer.from(book_number.toString())], programId)
    
   
    let book = new Book();
    book.book_no = Number(book_number);
    book.number_of_books = 0;
    book.in_circulation = 0;

    let encoded = borsh.serialize(BookSchema, book)
    const concated = Uint8Array.of(3, ...encoded)

    const instructionData = Buffer.from(concated);

    const ix = new TransactionInstruction({
        programId: programId,
        keys: [
            {pubkey: book_pubkey[0], isSigner: false, isWritable: true},
            {pubkey: payer.publicKey, isSigner: true, isWritable: true},
        ],
        data: instructionData
    });

    const blockHash = await connection.getLatestBlockhash();
    const message = new TransactionMessage({
        instructions: [ix],
        payerKey: payer.publicKey,
        recentBlockhash: blockHash.blockhash,
    }).compileToV0Message();

    const tx = new VersionedTransaction(message);
    tx.sign([payer]);

    const signature = await connection.sendTransaction(tx)
    console.log("Remove book transaction signature: ", signature)

}
//borrowBook
const borrowBook = async (user_id: bigint, book_id: bigint) => {
    const book_pubkey = PublicKey.findProgramAddressSync([Buffer.from("BC"), Buffer.from(book_id.toString())], programId)
    const user_pubkey = PublicKey.findProgramAddressSync([Buffer.from("UA"), Buffer.from(user_id.toString())], programId)

    const ix = new TransactionInstruction({
        programId: programId,
        keys: [
            {pubkey: book_pubkey[0], isSigner: false, isWritable:true},
            {pubkey: user_pubkey[0], isSigner:false, isWritable:true},
            {pubkey: payer.publicKey, isSigner: true, isWritable:true}
        ],
        data: Buffer.from([4])
    });

    const blockHash = await connection.getLatestBlockhash();
    const message = new TransactionMessage({
        instructions: [ix],
        payerKey: payer.publicKey,
        recentBlockhash: blockHash.blockhash
    }).compileToV0Message();

    const tx = new VersionedTransaction(message);
    tx.sign([payer]);

    const signature = await connection.sendTransaction(tx);
    console.log("Borrow book transaction signature:", signature)
};
//returnBook

const returnBook = async (user_number: bigint, book_number: bigint) => {
    const book_pubkey = PublicKey.findProgramAddressSync([Buffer.from("BC"), Buffer.from(book_number.toString())], programId)
    const user_pubkey = PublicKey.findProgramAddressSync([Buffer.from("UA"), Buffer.from(user_number.toString())], programId)


    const ix = new TransactionInstruction({
        programId: programId,
        keys: [
            {pubkey: book_pubkey[0], isSigner: false, isWritable: true},
            {pubkey: user_pubkey[0], isSigner: false, isWritable: true},
            {pubkey: payer.publicKey, isSigner: true, isWritable: true}
        ],
        data: Buffer.from([5])
    });

    const blockHash = await connection.getLatestBlockhash();
    const message = new TransactionMessage({
        instructions: [ix],
        payerKey: payer.publicKey,
        recentBlockhash: blockHash.blockhash
    }).compileToV0Message();

    const tx = new VersionedTransaction(message);
    tx.sign([payer]);

    const signature = await connection.sendTransaction(tx);
    console.log("Return Book Transaction signature:", signature);
}

//configuration
const configuration = async () => {
    const authorityPubKey = payer.publicKey;

    const configPubKey = PublicKey.findProgramAddressSync([Buffer.from("authority")], programId);

    const ix = new TransactionInstruction({
        programId: programId,
        keys: [
            {pubkey: configPubKey[0], isSigner: false, isWritable:true},
            {pubkey: payer.publicKey,isSigner: true, isWritable: true},
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
        ],
        data: Buffer.from([6]),
    });

    const blockHash = await connection.getLatestBlockhash();
    const message = new TransactionMessage({
        instructions: [ix],
        payerKey: payer.publicKey,
        recentBlockhash: blockHash.blockhash
    }).compileToV0Message();

    const tx = new VersionedTransaction(message);
    tx.sign([payer]);

    const signature = await connection.sendTransaction(tx);
    console.log("configuration Transaction signature: ", signature)
} 

const checkAuthority = async () => {
    
    const authorityPubKey1 = new PublicKey("");
    const authorityPubKey2 = new PublicKey("");
    const authorityPubKey3 = new PublicKey("");

    const configPubKey = PublicKey.findProgramAddressSync([Buffer.from("authority")],programId);

    const ix = new TransactionInstruction({
        programId: programId,
        keys: [
            { pubkey: configPubKey[0], isSigner: false, isWritable: false }, 
            { pubkey: authorityPubKey1, isSigner: true, isWritable: false }, 
            { pubkey: authorityPubKey2, isSigner: true, isWritable: false }, 
            { pubkey: authorityPubKey3, isSigner: true, isWritable: false }, 
        ],
        data: Buffer.from([7]), 
    });

    const blockHash = await connection.getLatestBlockhash();
    const message = new TransactionMessage({
        instructions: [ix],
        payerKey: authorityPubKey1, 
        recentBlockhash: blockHash.blockhash
    }).compileToV0Message();

    const tx = new VersionedTransaction(message);
    //tx.sign([authorityPubKey1, authorityPubKey2, authorityPubKey3]); 

    try {
        const signature = await connection.sendTransaction(tx);
        console.log("CheckAuthority Transaction signature:", signature);
        const confirmation = await connection.confirmTransaction(signature, "confirmed");
        console.log("Transaction confirmed:", confirmation);
    } catch (error) {
        console.error("Error checking authority:", error);
    }
}

//checkAuthority

//updateAuthority


//initializeCounter()
//readCounter()
//createNewUserAccount()
//readUserAccount("6")
//createBook()
//readBookAccount("6")
//addBook(BigInt(45), BigInt(5))     
//readBookAccount("5")
//removeBook(BigInt(5))            
//readBookAccount("5")
//borrowBook(BigInt(5),BigInt(5))
//readBookAccount("5")
//readUserAccount("5")                
//returnBook(BigInt(5), BigInt(5))
//readBookAccount("5")
//readUserAccount("5")
configuration()