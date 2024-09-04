// (User) default values and schema definition
export class User{ 
    user_no: number = 0; 
    user_address: number[] = Array.from({length:32}, () => 0);
    book_no: number = 0; 
    borrowed_at: number = 0;
    return_by: number = 0;
    constructor(
        fields: 
        {    
            user_no:number; 
            user_address:number []
            book_no:number; 
            borrowed_at: number;
            return_by: number;
        } 
        | undefined = undefined) 
        {if (fields) 
            { 
                this.user_no = fields.user_no; 
                this.user_address = fields.user_address;
                this.book_no = fields.book_no; 
                this.borrowed_at = fields.borrowed_at;
                this.return_by = fields.return_by;
            } 
        } 
    }

export const UserSchema = new Map(
    [ 
        [ User, 
            { kind: "struct", 
                fields: 
                [ 
                    ["user_no","u64"], 
                    ["user_address",["u8",32]],
                    ["book_no","u64"], 
                    ["borrowed_at", "u64"],
                    ["return_by", "u64"],
                ], 
            }, 
        ], 
    ]
)

// (Book) default values and schema definition
export class Book{ 
    book_no: number = 0; 
    number_of_books: number = 0; 
    in_circulation: number = 0;
    total_number_of_books: number = 0;
    constructor(
        fields: 
        {    
            book_no: number; 
            number_of_books: number;
            in_circulation: number; 
            total_number_of_books: number;
        } 
        | undefined = undefined) 
        {if (fields) 
            { 
                this.book_no = fields.book_no; 
                this.number_of_books = fields.number_of_books;
                this.in_circulation = fields.in_circulation; 
                this.total_number_of_books = fields.total_number_of_books;
            } 
        } 
    }

export const BookSchema = new Map(
    [ 
        [ Book, 
            { kind: "struct", 
                fields: 
                [ 
                    ["book_no","u64"], 
                    ["number_of_books","u64"], 
                    ["in_circulation", "u64"],
                    ["total_number_of_books", "u64"]
                 ], 
             }, 
         ], 
     ]
 )

// (Counter) default values and schema definition
export class Counter{ 
    counter: number = 0; 
    constructor(
        fields: 
        {    
            counter: number; 
        } 
        | undefined = undefined) 
        {if (fields) 
            { 
                this.counter = fields.counter; 
            } 
        } 
    }

export const CounterSchema = new Map(
    [ 
        [ Counter, 
            { kind: "struct", 
                fields: 
                [ 
                    ["counter","u64"], 
                 ], 
             }, 
         ], 
     ]
 )

 export class BookNumber{ 
    book_number: bigint = BigInt(0); 
    constructor(
        fields: 
        {    
            book_number: bigint; 
        } 
        | undefined = undefined) 
        {if (fields) 
            { 
                this.book_number = fields.book_number; 
            } 
        } 
    }

export const BookNumberSchema = new Map(
    [ 
        [ BookNumber, 
            { kind: "struct", 
                fields: 
                [ 
                    ["book_number","u64"], 
                 ], 
             }, 
         ], 
     ]
 )