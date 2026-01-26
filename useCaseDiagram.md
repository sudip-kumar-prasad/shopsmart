```mermaid
usecaseDiagram
    actor "Guest User" as Guest
    actor "Registered Customer" as Customer
    actor "Admin" as Admin

    package "ShopSmart Application" {
        usecase "View Landing Page" as UC1
        usecase "Search Products" as UC2
        usecase "View Product Details" as UC3
        usecase "Register / Login" as UC4
        usecase "Add to Cart" as UC5
        usecase "View Cart" as UC6
        usecase "Checkout" as UC7
        usecase "Place Order" as UC8
        usecase "View Order History" as UC9
        usecase "Manage Products (CRUD)" as UC10
        usecase "View All Orders" as UC11
    }

    Guest --> UC1
    Guest --> UC2
    Guest --> UC3
    Guest --> UC4

    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7
    Customer --> UC8
    Customer --> UC9
    
    Admin --> UC4
    Admin --> UC10
    Admin --> UC11

    note right of Admin
      Admin has all Customer privileges
      plus management capabilities
    end note
```
