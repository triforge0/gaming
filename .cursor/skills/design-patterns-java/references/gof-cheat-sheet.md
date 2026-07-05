# Gang of Four (GoF) Design Patterns Cheat Sheet

Tài liệu tra cứu nhanh 23 Design Patterns kinh điển, phân loại theo 3 nhóm mục đích: **Creational** (Khởi tạo), **Structural** (Cấu trúc), và **Behavioral** (Hành vi).

---

## 1. Creational Patterns (Nhóm Khởi Tạo)
*Tập trung vào cơ chế khởi tạo đối tượng, giúp giảm sự phụ thuộc trực tiếp vào toán tử `new`.*

| Pattern | Mục đích (Intent) | Trực quan hóa / Từ khóa |
| :--- | :--- | :--- |
| **Singleton** | Đảm bảo một class chỉ có duy nhất một instance toàn cục. | *Unique instance, Global Access* |
| **Factory Method**| Định nghĩa interface tạo object, nhưng để subclass quyết định class cụ thể nào được tạo. | *Virtual Constructor, Dynamic Creation* |
| **Abstract Factory**| Tạo ra một họ (family) các đối tượng liên quan hoặc phụ thuộc nhau mà không cần chỉ định class cụ thể. | *Kit, Factory of Factories* |
| **Builder** | Tách rời quá trình dựng một đối tượng phức tạp khỏi biểu diễn của nó, cho phép tạo các cấu hình khác nhau cùng một quy trình. | *Telescoping Constructor Solution, Fluent API* |
| **Prototype** | Tạo đối tượng mới bằng cách sao chép (clone) một đối tượng mẫu có sẵn thay vì khởi tạo từ đầu. | *Clone, Deep/Shallow Copy* |

---

## 2. Structural Patterns (Nhóm Cấu Trúc)
*Giải quyết cách kết hợp các class và object để tạo thành các cấu trúc lớn hơn, linh hoạt hơn.*

| Pattern | Mục đích (Intent) | Trực quan hóa / Từ khóa |
| :--- | :--- | :--- |
| **Adapter** | Chuyển đổi interface của một class thành một interface khác mà client mong muốn, giúp các class bất đồng bộ làm việc được với nhau. | *Wrapper, Translator, Third-party Integration* |
| **Bridge** | Tách biệt tính trừu tượng (Abstraction) khỏi phần hiện thực (Implementation) để cả hai có thể thay đổi độc lập. | *Handle/Body, Multi-dimensional Variation* |
| **Composite** | Tổ chức các đối tượng theo cấu trúc cây (Tree) để biểu diễn mối quan hệ một-nhiều. Giúp client xử lý đồng nhất giữa đối tượng đơn lẻ và tập hợp đối tượng. | *Tree Structure, Part-Whole Hierarchy* |
| **Decorator** | Thêm thắt tính năng hoặc trách nhiệm cho một đối tượng một cách linh hoạt tại thời điểm runtime mà không làm ảnh hưởng đến các đối tượng khác. | *Smart Wrapper, Extension over Inheritance* |
| **Facade** | Cung cấp một interface đơn giản, duy nhất cho một hệ thống con (subsystem) phức tạp phía sau. | *Unified Interface, Gateway, Simplifier* |
| **Flyweight** | Chia sẻ các đối tượng nhỏ, có chung thuộc tính để tiết kiệm tối đa bộ nhớ (RAM) khi phải xử lý số lượng lớn thực thể. | *Cache, Shared Intrinsic State* |
| **Proxy** | Cung cấp một đối tượng đại diện hoặc thay thế cho một đối tượng khác để kiểm soát quyền truy cập, lazy loading, hoặc log dữ liệu. | *Surrogate, Placeholder, Access Control* |

---

## 3. Behavioral Patterns (Nhóm Hành Vi)
*Tập trung vào sự tương tác, phân phối trách nhiệm và giao tiếp giữa các đối tượng.*

| Pattern | Mục đích (Intent) | Trực quan hóa / Từ khóa |
| :--- | :--- | :--- |
| **Chain of Responsibility** | Chuyển giao yêu cầu (request) dọc theo một chuỗi các đối tượng xử lý. Mỗi đối tượng sẽ quyết định tự xử lý hoặc chuyển tiếp cho đối tượng kế tiếp. | *Middleware, Event Bubbling, Handler Link* |
| **Command** | Đóng gói một yêu cầu/hành động thành một đối tượng độc lập, cho phép tham số hóa client, xếp hàng (queue), và hỗ trợ hoàn tác (Undo/Redo). | *Action Object, Callback Encapsulation* |
| **Interpreter** | Định nghĩa một biểu diễn ngữ pháp cho một ngôn ngữ cụ thể cùng với một bộ thông dịch để xử lý các câu lệnh trong ngôn ngữ đó. | *Grammar Evaluator, SQL/Regex Parser* |
| **Iterator** | Cung cấp cách thức truy cập tuần tự vào các phần tử của một tập hợp đối tượng mà không cần để lộ cấu trúc dữ liệu bên trong của tập hợp đó. | *Cursor, Collection Traversal* |
| **Mediator** | Định nghĩa một đối tượng trung gian để điều phối giao tiếp giữa một nhóm các đối tượng khác, giúp giảm bớt sự liên kết chặt chẽ (loose coupling) giữa chúng. | *Air Traffic Controller, Hub, Decoupler* |
| **Memento** | Lưu lại trạng thái nội bộ của một đối tượng tại một thời điểm mà không vi phạm nguyên tắc đóng gói, giúp khôi phục lại trạng thái cũ khi cần. | *Snapshot, Restore Point, Undo Mechanism* |
| **Observer** | Định nghĩa mối quan hệ phụ thuộc 1-nhiều. Khi một đối tượng thay đổi trạng thái, tất cả các đối tượng đăng ký (subscribers) sẽ tự động nhận thông báo. | *Publish-Subscribe, Event Listener* |
| **State** | Cho phép một đối tượng thay đổi hoàn toàn hành vi của nó khi trạng thái nội bộ thay đổi. Đối tượng sẽ giống như thể biến đổi thành một class khác. | *State Machine, Context-Driven Behavior* |
| **Strategy** | Định nghĩa một tập hợp các thuật toán, đóng gói từng thuật toán lại và cho phép chúng hoán đổi linh hoạt cho nhau lúc runtime. | *Interchangeable Algorithm, Open-Closed Rule* |
| **Template Method** | Định nghĩa bộ khung của một thuật toán trong một hàm, trì hoãn một số bước cụ thể cho các subclass tự triển khai mà không làm đổi cấu trúc chung. | *Skeleton Framework, Hook Methods* |
| **Visitor** | Cho phép bạn định nghĩa một toán tử/hành vi mới trên một cấu trúc đối tượng có sẵn mà không cần phải chỉnh sửa code của các class trong cấu trúc đó. | *Double Dispatch, Operation Separation* |