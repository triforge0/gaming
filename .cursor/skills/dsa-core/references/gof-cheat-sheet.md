# DSA Complexity Cheat Sheet

## Data Structure Operations

| Data Structure | Access | Search | Insertion | Deletion | Space Complexity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Array / Vector** | $O(1)$ | $O(N)$ | $O(N)$ | $O(N)$ | $O(N)$ |
| **Linked List** | $O(N)$ | $O(N)$ | $O(1)$ | $O(1)$ | $O(N)$ |
| **Stack / Queue** | $O(N)$ | $O(N)$ | $O(1)$ | $O(1)$ | $O(N)$ |
| **Hash Table** | $O(1)$ | $O(1)$ | $O(1)$ | $O(1)$ | $O(N)$ |
| **BST (Balanced)** | $O(\log N)$ | $O(\log N)$ | $O(\log N)$ | $O(\log N)$ | $O(N)$ |
| **Graph (Adjacency List)** | — | — | — | — | $O(V + E)$ |

## Standard Sorting Algorithms

| Algorithm | Best Time | Average Time | Worst Time | Space Complexity | Stable? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Quick Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N^2)$ | $O(\log N)$ | No |
| **Merge Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(N)$ | Yes |
| **Heap Sort** | $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(1)$ | No |

## Big-O vs Input Size Guide (The $10^8$ Operations Rule)
Dựa vào kích thước của dữ liệu đầu vào ($N$), đây là độ phức tạp tối đa được chấp nhận để code không bị quá thời gian (Time Limit Exceeded - TLE):

* **$N \le 10$** $\rightarrow O(N!)$ hoặc $O(N^2 \cdot 2^N)$ (Hoán vị, Trạng thái DP phức tạp)
* **$N \le 20$** $\rightarrow O(2^N)$ (Backtracking, Đệ quy nhánh)
* **$N \le 500$** $\rightarrow O(N^3)$ (Floyd-Warshall, Đồ thị nhỏ)
* **$N \le 5000$** $\rightarrow O(N^2)$ (Mảng 2 vòng lặp lồng nhau, DP cơ bản)
* **$N \le 10^5$** $\rightarrow O(N \log N)$ (Sorting, Binary Search, Segment Tree)
* **$N \le 10^7$** $\rightarrow O(N)$ (Two Pointers, Sliding Window, Duyệt mảng tuyến tính)
* **$N > 10^8$** $\rightarrow O(\log N)$ hoặc $O(1)$ (Toán học, Binary Search trên đáp án lớn)