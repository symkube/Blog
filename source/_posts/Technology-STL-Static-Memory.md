---
title: 「黑科技」静态化 STL 容器内存
date: 2017-05-30 23:02:08
tags:
  - 学习笔记
  - 黑科技
categories:
  - oi
  - 学习笔记
---
在 OI 中，我们手写的数据结构几乎都是静态内存的，而 STL 中的容器由于内存动态化的原因在做题中容易 TLE，这里介绍几种常见容器静态化内存的方法。
<!-- more -->
### 连续内存容器
对于 vector, queue, deque 等使用连续内存块的容器 STL 的二级空间配置器在 O2 优化下已相当优秀，唯一的提升空间就是更改扩容量，对于这些容器这里只简单介绍一些提升效率技巧，并不会将其内存静态化。
#### vector
vector 有一个 `reserve` 方法相信大家都知道了，使用前分配完全就不会引起扩容。
对于 vector 实现的邻接表，如果题目一定卡了 vector 的扩容，我们可以先开一个桶统计每个点的边数，然后对于每个点 `reserve` 对应值就可以了。
#### queue
对于 queue 我们其实是可以随机访问其中的元素，万不得已时，我们是可以手动维护首尾指针的 (如 NOIP 2016 Day2 T2)。
queue 的部分定义如下:
``` cpp
template <typename _Tp, typename _Sequence = deque<_Tp> >
class queue {
    protected:
        _Sequence c;
};
```
由于 `c` 是 deque 且访问是 protected，所以我们继承 queue 就可以拿到底层的 `c`，然后就直接 `resize` 手动维护就好了。
``` cpp
template <typename T>
class Queue : 
    public std::queue<T> {
    
public:
    
    inline void resize(const int n) {
        c.resize(n);
    }

    inline T &operator[](const int i) {
        return c[i];
    }
};
```
#### priority_queue
同理 priority_queue 的底层 `c` 为 vector，我们继承它，然后 `reserve` (这比 queue 更方便，因为 deque 无法 `reserve`)。
``` cpp
class PriorityQueue : 
    public std::priority_queue<long, 
        std::vector<long>, std::greater<long> > {
    
public:
    
    inline void reserve(const int n) {
        c.reserve(n);
    }
} a;
```
### Allocator
在静态化 map, set 等容器内存前，我们得先了解空间配置器 (allocator)。
注意到 STL 容器中都用了空间配置器 (allocator)，对于 set, map 等容器，它们每次都只会分配或删除一个对象的内存，这就使我们可以很轻松的编写内存池，而不需要用到引用计数，标记清除，复制整理等垃圾回收算法。
#### 定义
我们在 `allocator.h` 中可以发现 allocator 继承自 \_\_allocator\_base，而在 `c++allocator.h` 中 \_\_allocator\_base 被替换成了 \_\_gnu_cxx::new\_allocator，所以我们直接在 `ext/new_allocator.h` 找到 new\_allocator 的定义如下:
``` cpp
template <typename _Tp>
class new_allocator {
   public:
    typedef size_t size_type;
    typedef ptrdiff_t difference_type;
    typedef _Tp *pointer;
    typedef const _Tp *const_pointer;
    typedef _Tp &reference;
    typedef const _Tp &const_reference;
    typedef _Tp value_type;

    template <typename _Tp1>
    struct rebind {
        typedef new_allocator<_Tp1> other;
    };

    new_allocator() _GLIBCXX_USE_NOEXCEPT {}

    new_allocator(const new_allocator &) _GLIBCXX_USE_NOEXCEPT {}

    template <typename _Tp1>
    new_allocator(const new_allocator<_Tp1> &) _GLIBCXX_USE_NOEXCEPT {}

    ~new_allocator() _GLIBCXX_USE_NOEXCEPT {}

    pointer address(reference __x) const _GLIBCXX_NOEXCEPT {
        return std::__addressof(__x);
    }

    const_pointer address(const_reference __x) const _GLIBCXX_NOEXCEPT {
        return std::__addressof(__x);
    }

    pointer allocate(size_type __n, const void * = 0) {
        if (__n > this->max_size()) std::__throw_bad_alloc();

        return static_cast<_Tp *>(::operator new(__n * sizeof(_Tp)));
    }

    void deallocate(pointer __p, size_type) { ::operator delete(__p); }

    size_type max_size() const _GLIBCXX_USE_NOEXCEPT {
        return size_t(-1) / sizeof(_Tp);
    }

#if __cplusplus >= 201103L
    template <typename _Up, typename... _Args>
    void construct(_Up *__p, _Args &&... __args) {
        ::new ((void *)__p) _Up(std::forward<_Args>(__args)...);
    }

    template <typename _Up>
    void destroy(_Up *__p) {
        __p->~_Up();
    }

    void construct(pointer __p, const _Tp &__val) {
        ::new ((void *)__p) _Tp(__val);
    }

    void destroy(pointer __p) { __p->~_Tp(); }

};

template <typename _Tp>
inline bool operator==(const new_allocator<_Tp> &, const new_allocator<_Tp> &) {
    return true;
}

template <typename _Tp>
inline bool operator!=(const new_allocator<_Tp> &, const new_allocator<_Tp> &) {
    return false;
}
```
#### 整理
把上述定义整理一下
``` cpp
template<typename Type>
class AllocBase {
public:
    typedef unsigned size_type;
    typedef int difference_type;
    typedef Type * pointer;
    typedef const Type * const_pointer;
    typedef Type & reference;
    typedef const Type & const_reference;
    typedef Type value_type;
 
    template<typename OtherType>
    struct rebind {
        typedef AllocBase<OtherType> other;
    };
     
    AllocBase() {}
 
    AllocBase(const AllocBase&) {}
 
    template<typename OtherType>
    AllocBase(const AllocBase<OtherType>&) {}
 
    ~AllocBase() {}
 
    inline pointer address(reference x) const {
        return &x;
    }
 
    inline const_pointer address(const_reference x) const {
        return &x;
    }
 
    inline pointer allocate(size_type n, const void* = 0) const {
        return static_cast<pointer>(operator new(n * sizeof(Type)));
    }
 
    inline void deallocate(pointer p, size_type n) const {
        operator delete(p);
    }
 
    inline size_type max_size() const {
        return size_type(-1) / sizeof(Type);
    }
 
    inline void construct(pointer p, const Type& val) const {
        new(static_cast<void*>(p)) Type(val);
    }
 
    inline void destroy(pointer p) const {
        p->~Type();
    }
};
```
我们发现只用修改 `allocate` 和 `deallocate` 方法就好了，对于基本类型我们还可以去掉 `construct` 和 `destroy` 里的操作进一步提升性能。
#### 源码
以下给出一个最简易的静态内存池，适用于 map，set 等容器的空间适配器。
``` cpp
template<typename Type>
class AllocBase {
public:
    typedef unsigned size_type;
    typedef int difference_type;
    typedef Type *pointer;
    typedef const Type *const_pointer;
    typedef Type &reference;
    typedef const Type &const_reference;
    typedef Type value_type;

    template <typename OtherType>
    struct rebind {
        typedef AllocBase<OtherType> other;
    };
     
    static Type memoryPool[MAXM], *p;
    static Type *bin[MAXM];
    static int cnt;
     
    AllocBase() {}
 
    AllocBase(const AllocBase&) {}
 
    template<typename OtherType>
    AllocBase(const AllocBase<OtherType>&) {}
 
    ~AllocBase() {}
 
    inline pointer address(reference x) const {
        return &x;
    }
 
    inline const_pointer address(const_reference x) const {
        return &x;
    }
    
    /* 分配内存 */
    inline pointer allocate(size_type n, const void* = 0) const {
        /* std::cerr << n << std::endl; */
        return cnt ? bin[cnt--] : p++;
        /* return static_cast<pointer>(operator new(n * sizeof(Type))); */
    }
    
    /* 释放内存 */
    inline void deallocate(pointer p, size_type n) const {
        bin[++cnt] = p;
        /* operator delete(p); */
    }
 
    inline size_type max_size() const {
        return size_type(-1) / sizeof(Type);
    }
 
    /* 构造，若为基本数据类型注释掉里面的操作会更快 */
    inline void construct(pointer p, const Type& val) const {
        new(static_cast<void*>(p)) Type(val);
    }
 
    /* 析构，若为基本数据类型注释掉里面的操作会更快 */
    inline void destroy(pointer p) const {
        p->~Type();
    }
};
```
#### 使用
上述给出的内存池是最简易的写法，并不支持分配块状内存 (若要分配，自行修改)，判断能否使用只需要在 `allocate` 输出 $n$，观察是否全为 $1$ 即可。
### set & map
对于 set 和 map 我们先看一下它们的定义。
#### 定义
``` cpp
template <typename _Key, typename _Compare = std::less<_Key>,
          typename _Alloc = std::allocator<_Key> >
class set {};

template <typename _Key, typename _Tp, typename _Compare = std::less<_Key>,
          typename _Alloc = std::allocator<std::pair<const _Key, _Tp> > >
class map {};
```
所以我们把上面的空间适配器直接拿来用就可以了，对于 `pb_ds` 中的 tree 也同理。
### 例子
#### 「HNOI2012」永无乡
##### 链接
[BZOJ 2733](http://www.lydsy.com/JudgeOnline/problem.php?id=2733)
##### 代码
题解这里就不说了，直接给静态 pb_ds tree 启发式合并的代码，效率 1056ms BZOJ rk8。
``` cpp
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>

const int MAXM = 250001;

template<typename Type>
class AllocBase {
public:
    typedef unsigned size_type;
    typedef int difference_type;
    typedef Type *pointer;
    typedef const Type *const_pointer;
    typedef Type &reference;
    typedef const Type &const_reference;
    typedef Type value_type;

    template <typename OtherType>
    struct rebind {
        typedef AllocBase<OtherType> other;
    };
	
	static Type memoryPool[MAXM], *p;
	static Type *bin[MAXM];
	static int cnt;
	
    AllocBase() {}

    AllocBase(const AllocBase&) {}

    template<typename OtherType>
    AllocBase(const AllocBase<OtherType>&) {}

    ~AllocBase() {}

    inline pointer address(reference x) const {
        return &x;
    }

    inline const_pointer address(const_reference x) const {
        return &x;
    }

    inline pointer allocate(size_type n, const void* = 0) const {
        /* std::cerr << n << std::endl; */
        return cnt ? bin[cnt--] : p++;
        /* return static_cast<pointer>(operator new(n * sizeof(Type))); */
    }

    inline void deallocate(pointer p, size_type n) const {
    	bin[++cnt] = p;
        /* operator delete(p); */
    }

    inline size_type max_size() const {
        return size_type(-1) / sizeof(Type);
    }

    inline void construct(pointer p, const Type& val) const {
        new(static_cast<void*>(p)) Type(val);
    }

    inline void destroy(pointer p) const {
        /* p->~Type(); */
    }
};

template<typename Type>
Type AllocBase<Type>::memoryPool[MAXM];
template<typename Type>
Type *AllocBase<Type>::p = memoryPool;
template<typename Type>
Type *AllocBase<Type>::bin[MAXM];
template<typename Type>
int AllocBase<Type>::cnt;

template<typename Type>
inline bool operator==(const AllocBase<Type>&, const AllocBase<Type>&) {
    return true;
}

template<typename Type>
inline bool operator!=(const AllocBase<Type>&, const AllocBase<Type>&) {
    return false;
}


inline char read() {
    static const int IN_LEN = 1000000;
    static char buf[IN_LEN], *s, *t;
    s == t ? t = (s = buf) + fread(buf, 1, IN_LEN, stdin) : 0;
    return s == t ? -1 : *s++;
}

template<class T>
inline void read(T &x) {
    static char c;
    static bool iosig;
    for (c = read(), iosig = false; !isdigit(c); c = read()) {
        if (c == -1) return;
        c == '-' ? iosig = true : 0;
    }
    for (x = 0; isdigit(c); c = read())
        x = (x + (x << 2) << 1) + (c ^ '0');
    iosig ? x = -x : 0;
}

const int OUT_LEN = 1000000;

char obuf[OUT_LEN], *oh = obuf;

inline void print(char c) {
    oh == obuf + OUT_LEN ? (fwrite(obuf, 1, OUT_LEN, stdout), oh = obuf) : 0;
    *oh++ = c;
}

template<class T>
inline void print(T x) {
    static int buf[30], cnt;
    if (x == 0) {
        print('0');
    } else {
        if (x < 0) print('-'), x = -x;
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 + 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}

namespace Task {

const int MAXN = 100005;

int fa[MAXN], rank[MAXN];
typedef __gnu_pbds::tree<int, int, std::less<int>, __gnu_pbds::rb_tree_tag, __gnu_pbds::tree_order_statistics_node_update, AllocBase<char> > Tree;
Tree t[MAXN];

inline int get(int x) {
    register int p = x, i;
    while (p != fa[p]) p = fa[p];
    while (p != x) i = fa[x], fa[x] = p, x = i;
    return p;
}

inline void put(int x, int y) {
    if ((x = get(x)) != (y = get(y))) {
        rank[x] > rank[y] ? (std::swap(x, y), 0) : 0;
        fa[x] = y;
        for (Tree::iterator it = t[x].begin(); it != t[x].end(); it++)
        	t[y][it->first] = it->second;
		rank[x] == rank[y] ? rank[y]++ : 0;
		t[x].clear(); 
    }
}

inline int query(int x, int k) {
    return k > t[x = get(x)].size() ? -1 : t[get(x)].find_by_order(k - 1)->second;
}

inline void solve() {
    register int n, m, q;
    read(n), read(m);
    for (register int i = 1, a; i <= n; i++)
        read(a), fa[i] = i, t[i][a] = i;
    for (register int i = 1, x, y; i <= m; i++) 
        read(x), read(y), put(x, y);
    read(q);
    register char c;
    while (q--) {
        c = read();
        while (isspace(c)) c = read();
        switch (c) {
            case 'B':
                read(n), read(m), put(n, m);
                break;
            case 'Q':
                read(n), read(m);
                print(query(n, m)), print('\n');
                break;
        }
    }
}

}

int main() {
    Task::solve(), flush();
    return 0;
}
```

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=729715&auto=1&height=66"></iframe>