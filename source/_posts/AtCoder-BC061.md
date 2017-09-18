---
title: 「AtCoder BC061」题解
date: 2017-05-13 22:12:40
tags:
categories:
  - OI
---
我并没有去打 CF，然后就跑去打第一场 AtCoder 刷水...
### 链接
[AtCode BC061](http://abc061.contest.atcoder.jp/)
<!-- more -->
### Between Two Integers
和 A + B Problem 一个难度直接写就好了...
#### 代码
``` cpp
/*******************************************************************************
 * Copyright (c) 2016-2017, xehoth
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name xehoth, nor the names of its contributors may be used
 *       to endorse or promote products derived from this software without 
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY XEHOTH AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL XEHOTH AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
#include <bits/stdc++.h>
/**
 * 「AtCoder Beginner Contest 061」Between Two Integers 13-05-2017
 * @author xehoth 
 */
namespace IO {

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
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

inline void solve() {
    using namespace IO;
    register int a, b, c;
    read(a), read(b), read(c);
    std::cout << ((c >= a && c <= b) ? "Yes\n" : "No\n");
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    return 0;
}
```
### Counting Roads
直接输出每个点的入度就好了...
#### 代码
``` cpp
/*******************************************************************************
 * Copyright (c) 2016-2017, xehoth
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name xehoth, nor the names of its contributors may be used
 *       to endorse or promote products derived from this software without 
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY XEHOTH AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL XEHOTH AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
#include <bits/stdc++.h>
/**
 * 「AtCoder Beginner Contest 061」Counting Roads 13-05-2017
 * @author xehoth 
 */
namespace IO {

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
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

const int MAXN = 55;

int in[MAXN];

inline void addEdge(const int u, const int v) {
    in[u]++, in[v]++;
}

inline void solve() {
    using namespace IO;
    register int n, m;
    read(n), read(m);
    for (register int i = 1, u, v; i <= m; i++)
        read(u), read(v), addEdge(u, v);
    for (register int i = 1; i <= n; i++)
        print(in[i]), print('\n');
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### Big Array
#### 题意
给你一个空数组，共 $m$ 个操作，每次往这个数组里面插入 $b_i$ 个 $a_i$，问第 $k$ 小。
#### 题解
读题时还以为要写平衡树，结果看完就无语了，直接排序不就完了(忘了数据范围这么小，直接桶排就好了，~~虽然 `sort` 也能过~~)，注意坑点在于 $k$ 在 `long long` 范围内。
#### 代码
``` cpp
/*******************************************************************************
 * Copyright (c) 2016-2017, xehoth
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name xehoth, nor the names of its contributors may be used
 *       to endorse or promote products derived from this software without 
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY XEHOTH AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL XEHOTH AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
#include <bits/stdc++.h>
/**
 * 「AtCoder Beginner Contest 061」Big Array 13-05-2017
 * @author xehoth 
 */
namespace IO {

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
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

const int MAXN = 100005;

struct Query {
    int a, b;

    inline bool operator<(const Query &n) const {
        return a < n.a || (a == n.a && b < n.b);
    }
} q[MAXN];

inline void solve() {
    using namespace IO;
    register int n;
    register long long k;
    read(n), read(k);
    for (register int i = 0; i < n; i++) {
        read(q[i].a), read(q[i].b);
    }
    std::sort(q, q + n);
    for (register int i = 0; i < n; i++) {
        if (k <= q[i].b) {
            print(q[i].a), print('\n');
            return;
        }
        k -= q[i].b;
    }
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    IO::flush();
    return 0;
}
```
### Score Attack
#### 题意
给定一个有向图，问 $1$ ~ $n$ 的最长路，如果无限长则输出 `inf`。
#### 题解
一眼看去直接 SPFA 跑最长路 + 判环就好了，然后 WA 最后三个点，发现此题坑点在于可能走了一个权值和为 $0$ 的环，而这种情况的路径长度并不是无限的，我们让点再多入一次队，判断 $dis_n$ 是否变化即可。
#### 代码
``` cpp
/*******************************************************************************
 * Copyright (c) 2016-2017, xehoth
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name xehoth, nor the names of its contributors may be used
 *       to endorse or promote products derived from this software without 
 *       specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY XEHOTH AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL XEHOTH AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 ******************************************************************************/
#include <bits/stdc++.h>
/**
 * 「AtCoder Beginner Contest 061」Score Attack 13-05-2017
 * @author xehoth 
 */
namespace IO {

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
        for (cnt = 0; x; x /= 10) buf[++cnt] = x % 10 | 48;
        while (cnt) print((char)buf[cnt--]);
    }
}

inline void flush() {
    fwrite(obuf, 1, oh - obuf, stdout);
}
}

namespace Task {

const int MAXN = 1010;

struct Node {
    int v;
    long long w;
    Node(int v, long long w) : v(v), w(w) {}
};

std::vector<Node> edge[MAXN];

inline void addEdge(const int u, const int v, const long long w) {
    edge[u].push_back(Node(v, w));
}

int num[MAXN], n;

long long dis[MAXN];

inline void spfa(int s) {
    static std::queue<int> q;
    static bool vis[MAXN];
    std::fill(dis, dis + n + 1, LLONG_MIN / 10);
    q.push(s), dis[s] = 0;
    register bool flag = false;
    register long long max = LLONG_MIN;
    register bool first = true;
    while (!q.empty()) {
        register int u = q.front();
        vis[u] = false, q.pop(), num[u]++;
        if (num[u] > n) {
            flag = true;
            break;
        }
        for (register int i = 0; i < edge[u].size(); i++) {
            Node *p = &edge[u][i];
            if (p->w + dis[u] > dis[p->v]) {
                dis[p->v] = p->w + dis[u];
                if (!vis[p->v]) {
                    if (p->v == n && first) {
                        max = dis[n], first = false;
                    }
                    q.push(p->v), vis[p->v] = true; 
                }
            }
        }
    }
    if (flag) {
        if (max == dis[n]) std::cout << dis[n] << "\n";
        else puts("inf");
        return;
    }
    std::cout << dis[n] << "\n";
}

inline void solve() {
    using namespace IO;
    register int m;
    read(n), read(m);
    register long long w;
    for (register int i = 0, u, v; i < m; i++) {
        read(u), read(v), read(w);
        addEdge(u, v, w);
    }
    spfa(1);
}
}

int main() {
#ifdef DBG
    freopen("in.in", "r", stdin);
#endif
    Task::solve();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=28234322&auto=1&height=66"></iframe>