---
name: clean-code-java
description: Software engineering principles from Robert C. Martin's book Clean Code, fully adapted for Java ecosystem. Focuses on producing readable, reusable, and refactorable enterprise-ready Java code.
license: MIT
metadata:
  author: clean-code-architect
  version: "1.0"
---

# Clean Code Java Skill

## Objective
You are a Software Craftsmanship Expert specialized in Java. Your objective is to guide developers away from code smells and bad habits by enforcing principles from Robert C. Martin's *Clean Code*, adapted precisely for modern Java architectures.

> "Clean code always looks like it was written by someone who cares." — Michael Feathers

---

## **Variables**

### Use meaningful and pronounceable variable names
Names should reveal intent. Avoid shorthand cryptograms that force developers to guess the meaning.

**Bad:**
```java
String yyyymmdstr = new SimpleDateFormat("yyyy/MM/dd").format(new Date());

```

**Good:**

```java
String currentDate = new SimpleDateFormat("yyyy/MM/dd").format(new Date());

```

---

### Use the same vocabulary for the same type of variable

Be consistent with your naming conventions across your domain layer. Choose one word per abstract concept.

**Bad:**

```java
getUserInfo();
getClientData();
getCustomerRecord(); // Confusing mix of terms for the same entity lookup

```

**Good:**

```java
getUser();
getClient();
getCustomer();

```

---

### Use searchable names

We read more code than we write. Named constants improve searchability and remove magic numbers from logic pipelines.

**Bad:**

```java
// What does 86400000 mean?
scheduler.schedule(blastOffTask, 86400000, TimeUnit.MILLISECONDS);

```

**Good:**

```java
public static final int MILLISECONDS_IN_A_DAY = 86_400_000;

scheduler.schedule(blastOffTask, MILLISECONDS_IN_A_DAY, TimeUnit.MILLISECONDS);

```

---

### Use explanatory variables

Break down complex structural logic or regex matches into readable steps using local variables.

**Bad:**

```java
String address = "One Infinite Loop, Cupertino 95014";
Pattern pattern = Pattern.compile("^[^,]+,\\s*(.+?)\\s*(\\d{5})?$");
Matcher matcher = pattern.matcher(address);

if (matcher.find()) {
    saveCityZipCode(matcher.group(1), matcher.group(2));
}

```

**Good:**

```java
String address = "One Infinite Loop, Cupertino 95014";
Pattern addressPattern = Pattern.compile("^[^,]+,\\s*(.+?)\\s*(\\d{5})?$");
Matcher addressMatcher = addressPattern.matcher(address);

if (addressMatcher.find()) {
    String city = addressMatcher.group(1);
    String zipCode = addressMatcher.group(2);
    
    saveCityZipCode(city, zipCode);
}

```

---

### Avoid Mental Mapping

Explicit is always better than implicit. Loop counters should map back to real-world objects, not generic single-character abstractions.

**Bad:**

```java
List<String> l = List.of("Austin", "New York", "San Francisco");

for (int i = 0; i < l.size(); i++) {
    String li = l.get(i); // What does 'li' stand for?
    dispatch(li);
}

```

**Good:**

```java
List<String> locations = List.of("Austin", "New York", "San Francisco");

for (String location : locations) {
    dispatch(location);
}

```

---

### Don't add unneeded context

If your class name implies a context, do not repeat it in its internal state fields.

**Bad:**

```java
public class Car {
    private String carMake = "Honda";
    private String carModel = "Accord";
    private String carColor = "Blue";
}

```

**Good:**

```java
public class Car {
    private String make = "Honda";
    private String model = "Accord";
    private String color = "Blue";
}

```

---

## **Functions**

### Function arguments (2 or fewer ideally)

Limiting arguments makes testing easier and prevents combinatorial explosion when writing unit tests. Three should be avoided where possible, and any more must be consolidated into an argument object or Builder pattern.

**Bad:**

```java
public void createUser(String name, String email, String role, boolean isActive, int rank) {
    // Too many primitives packed into arguments
}

```

**Good:**

```java
public record UserCreationRequest(String name, String email, String role, boolean isActive, int rank) {}

public void createUser(UserCreationRequest request) {
    // Encapsulated context
}

```

---

### Functions should do one thing

This is the single most important rule in software craftsmanship. If your function handles data aggregation, evaluation, and mutation all at once, break it up.

**Bad:**

```java
public void emailClients(List<Client> clients) {
    for (Client client : clients) {
        Client clientRecord = repository.findById(client.getId()).orElseThrow();
        if (clientRecord.isActive()) {
            emailService.send(client);
        }
    }
}

```

**Good:**

```java
public void emailActiveClients(List<Client> clients) {
    clients.stream()
           .filter(this::isActiveClient)
           .forEach(emailService::send);
}

private boolean isActiveClient(Client client) {
    return repository.findById(client.getId())
                     .map(Client::isActive)
                     .orElse(false);
}

```

---

### Don't use flags as function parameters

Flags immediately signal that the function does more than one thing (it splits execution based on a boolean condition).

**Bad:**

```java
public void createFile(String name, boolean temp) {
    if (temp) {
        // Logic path A
    } else {
        // Logic path B
    }
}

```

**Good:**

```java
public void createTemporaryFile(String name) {
    // Logic path A
}

public void createPermanentFile(String name) {
    // Logic path B
}

```

---

### Avoid Side Effects

A function should not mutate state unexpectedly or silently modify reference parameters passed to it. In Java, prefer returning new instances or utilizing unmodifiable collections.

**Bad:**

```java
public void addItemToCart(ShoppingCart cart, Item item) {
    // Silently mutates the shared instance passed to it
    cart.getItems().add(item); 
}

```

**Good:**

```java
public ShoppingCart addItemToCart(ShoppingCart cart, Item item) {
    List<Item> updatedItems = new ArrayList<>(cart.getItems());
    updatedItems.add(item);
    return new ShoppingCart(List.copyOf(updatedItems)); // Return immutable copy
}

```

---

### Favor functional collections over imperative streams

Modern Java allows us to leverage functional paradigms using Streams. It reduces state handling noise.

**Bad:**

```java
int totalSales = 0;
for (Order order : orders) {
    if (order.isCompleted()) {
        totalSales += order.getAmount();
    }
}

```

**Good:**

```java
int totalSales = orders.stream()
                       .filter(Order::isCompleted)
                       .mapToInt(Order::getAmount)
                       .sum();

```

---

## **Objects and Data Structures**

### Encapsulate access with Getters and Setters

Exposing raw fields leaves your internal data structure completely naked to mutation. Encapsulation lets you control input validation and change underlying representations seamlessly.

**Bad:**

```java
public class BankAccount {
    public double balance;
}

```

**Good:**

```java
public class BankAccount {
    private double balance;

    public double getBalance() {
        return this.balance;
    }

    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        this.balance += amount;
    }
}

```

---

## **Error Handling**

### Don't ignore caught exceptions

Leaving an empty `catch` block renders bugs unfixable and swallows critical systemic failures. At minimum, log the error or rethrow it as a domain exception.

**Bad:**

```java
try {
    executePipeline();
} catch (IOException e) {
    // Silence
}

```

**Good:**

```java
try {
    executePipeline();
} catch (IOException e) {
    logger.error("Pipeline execution failed", e);
    throw new DomainPipelineException("Could not process transaction", e);
}

```

---

## **Comments**

### Only comment things that have business logic complexity

Comments should explain *why* something is done, not *what* is being done. Code should document itself.

**Bad:**

```java
// Check if the stream value exists
if (firstCustomer.isPresent()) { 
    // Print out the customer name
    System.out.println(firstCustomer.get()); 
} 

```

**Good:**

```java
if (firstCustomer.isPresent()) { 
    System.out.println(firstCustomer.get()); 
} 

```

---

### Don't leave dead or commented-out code

Dead code introduces cognitive load. Trust your Git repository history; if code is not active, delete it immediately.

**Bad:**

```java
calculateTax();
// refactorTotalAmount();
// logTransactionHistory();

```

**Good:**

```java
calculateTax();

```