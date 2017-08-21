---
title: '「NOIP 2015」斗地主-状压搜索'
date: 2016-11-03 22:50:23
tags:
  - oi
  - c++
  - 搜索
categories: 
  - oi
  - 搜索
---
### 链接
来源：NOIP2015提高组 Day1 T3
[bzoj4325](http://www.lydsy.com/JudgeOnline/problem.php?id=4325)
数据加强版：[uoj151](http://uoj.ac/problem/151)
### 暴搜
以每种点数的牌的数量为状态，状态可压缩进一个 64 位整数中，搜索。
我们可以建一个HashMap存储，直接暴搜就能过(vijos上的加强数据会T，uoj的加强数据上被zz gyr给卡了)...
<!-- more -->
``` cpp
#include <bits/stdc++.h>
using namespace std;
const int iol = 1024 * 1024;
char buf[iol], *s, *t, ioc;
bool iosig;
inline char read() {
    if(s == t) {
         t = (s = buf) + fread(buf, 1, iol, stdin);
         if(s == t) return -1;
    }
    return *s++;
}
template<class T>
inline bool read(T& x) {
    iosig = false;
    for(ioc = read(); !isdigit(ioc); ioc = read()) {
        if(ioc == -1) return false;
        if(ioc == '-') iosig = true;
    }
    x = 0;
    while(ioc == '0') ioc = read();
    for(; isdigit(ioc); ioc = read())
        x = (x << 1) + (x << 3) + (ioc ^ '0');
    s--;
    if(iosig) x = -x;
    return true;
}
#define MAXN 13
/*JOKER 0
 *  2   1
 *  3   2
 *  4   3
 *  5   4
 *  6   5
 *  7   6
 *  8   7
 *  9   8
 *  10  9
 *  J   10
 *  Q   11
 *  K   12
 *  A   13
 */
typedef unsigned long long Status;

struct HashMap {
    const static int HASH_SIZE = 7979717;
    struct Node {
        Status key;
        int val, time;
    } N[HASH_SIZE];
    int time;
    HashMap() : time(1) {}
    inline int locate(const Status &key) {
        register int i;
        for (i = key % HASH_SIZE; N[i].time == time && N[i].key != key; (i < HASH_SIZE - 1) ? (i++) : (i = 0));
        if (N[i].time != time) {
            N[i].time = time;
            N[i].key = key;
            N[i].val = INT_MAX;
        }
        return i;
    }
    inline int &operator[](const Status &key) {
        return N[locate(key)].val;
    }
    inline void clear() {
        time++;
    }
} h;
inline int getid(const int x) {
    if (x == 1) return 13;
    return (x >= 2 && x <= 13) ? (x - 1) : x;
}
inline int getCard(const Status &s, const int index) {
    return (s >> (index << 2)) & 15ll;
}
/*#ifdef DBG
inline void print(const Status &s, const bool newLine = true) {
    for (int i = 0; i < 14; i++) cout << getCard(s, i) << " ";
    if (newLine) cout << "\n";
}
#endif*/
inline void setCard(Status &s, const int index, const int val) {
/*#ifdef DBG
    assert(val >= 0);
    print(s, false);
    printf("=> ");
#endif*/
    s &= ~(15ll << (index << 2));
    s |= (val & 15ll) << (index << 2);
/*#ifdef DBG
    print(s);
#endif*/
}
inline void changeCard(Status &s, const int index, const int delta) {
    setCard(s, index, getCard(s, index) + delta);
}
int n, ans;
inline void dfs(const Status &s, const int step = 0) {
/*#ifdef DBG
    print(s, false);
    printf("[%d, %d]\n", step, ans);
#endif*/
    if (step >= ans) return;
    int &x = h[s];
    if (step >= x) return;
    x = step;
    if (!s) {
        ans = step;
        return;
    }
    /* 333 444 */
    for (register int i = 2; i <= 12; i++) {
        Status next = s;
        register int x = getCard(next, i);
        if (x < 3) {
            continue;
        } else setCard(next, i, x - 3);
        for (register int j = i + 1; j <= 13; j++) {
            int x = getCard(next, j);
            if (x < 3) {
                break;
            } else {
                setCard(next, j, x - 3);
                dfs(next, step + 1);
            }
        }
    }
    /* 33 44 55 */
    for (register int i = 2; i <= 11; i++) {
        bool valid = true;
        Status next = s;
        for (register int j = i; j < i + 2; j++) {
            register int x = getCard(next, j);
            if (x < 2) {
                valid = false;
                break;
            } else setCard(next, j, x - 2);
        }
        if (!valid) continue;
        for (register int j = i + 2; j <= 13; j++) {
            register int x = getCard(next, j);
            if (x < 2) {
                break;
            } else {
                setCard(next, j, x - 2);
                dfs(next, step + 1);
            }
        }
    }
    /* 3 4 5 6 7 */
    for (register int i = 2; i <= 9; i++) {
        bool valid = true;
        Status next = s;
        for (register int j = i; j < i + 4; j++) {
            register int x = getCard(next, j);
            if (x < 1) {
                valid = false;
                break;
            } else setCard(next, j, x - 1);
        }
        if (!valid) continue;
        for (register int j = i + 4; j <= 13; j++) {
            register int x = getCard(next, j);
            if (x < 1) {
                break;
            } else {
                setCard(next, j, x - 1);
                dfs(next, step + 1);
            }
        }
    }
    vector<int> four, three, two, one;
    for (register int i = 0; i <= 13; i++) {
        register  int x = getCard(s, i);
        if (x == 4) four.push_back(i);
        else if (x == 3) three.push_back(i);
        else if (x == 2) two.push_back(i);
        else if (x == 1) one.push_back(i);
    }
    /* 2222 [3 4] / 2222 [33 44] */
    for (vector<int>::const_iterator it = four.begin(); it != four.end(); it++) {
        Status tmp = s;
        setCard(tmp, *it, 0);
        for (vector<int>::const_iterator a = two.begin(); a != two.end(); a++) {
            if (*a == 0) continue;
            for (vector<int>::const_iterator b = a + 1; b != two.end(); b++) {
                if (*b == 0) continue;
                Status next = tmp;
                setCard(next, *a, 0);
                setCard(next, *b, 0);
                dfs(next, step + 1);
            }
            for (vector<int>::const_iterator b = three.begin(); b != three.end(); b++) {
                Status next = tmp;
                changeCard(next, *a, -2);
                changeCard(next, *b, -2);
                dfs(next, step + 1);
            }
            Status next = tmp;
            setCard(next, *a, 0);
            dfs(next, step + 1);
        }
        for (vector<int>::const_iterator a = four.begin(); a != four.end(); a++) {
            if (*a == *it) continue;
            Status next = tmp;
            setCard(next, *a, 0);
            dfs(next, step + 1);
        }
        for (vector<int>::const_iterator a = one.begin(); a != one.end(); a++) {
            for (vector<int>::const_iterator b = a + 1; b != one.end(); b++) {
                Status next = tmp;
                setCard(next, *a, 0);
                setCard(next, *b, 0);
                dfs(next, step + 1);
            }
            for (vector<int>::const_iterator b = three.begin(); b != three.end(); b++) {
                Status next = tmp;
                changeCard(next, *a, -1);
                changeCard(next, *b, -1);
                dfs(next, step + 1);
            }
        }
        dfs(tmp, step + 1);
    }
    /* 222 [3] / 222 [33]*/
    for (vector<int>::const_iterator it = three.begin(); it != three.end(); it++) {
        Status tmp = s;
        setCard(tmp, *it, 0);
        for (vector<int>::const_iterator a = three.begin(); a != three.end(); a++) {
            if (*a == *it) continue;
            Status next = tmp;
            changeCard(next, *a, -1);
            dfs(next, step + 1);
            changeCard(next, *a, -1);
            dfs(next, step + 1);
        }
        for (vector<int>::const_iterator a = two.begin(); a != two.end(); a++) {
            if (*a == 0) {
                /* Take only one joker */
                Status next = tmp;
                setCard(next, *a, 1);
                dfs(next, step + 1);
                continue;
            }
            Status next = tmp;
            setCard(next, *a, 0);
            dfs(next, step + 1);
        }
        for (vector<int>::const_iterator a = one.begin(); a != one.end(); a++) {
            Status next = tmp;
            setCard(next, *a, 0);
            dfs(next, step + 1);
        }
        dfs(tmp, step + 1);
    }
    /* 22 */
    for (vector<int>::const_iterator it = two.begin(); it != two.end(); it++) {
        Status next = s;
        setCard(next, *it, 0);
        dfs(next, step + 1);
    }
    /* 2 */
    for (vector<int>::const_iterator it = one.begin(); it != one.end(); it++) {
        Status next = s;
        setCard(next, *it, 0);
        dfs(next, step + 1);
    }
}
int main() {
    register int t;
    read(t), read(n);
    while (t--) {
        Status init = 0;
        for (register int i = 0; i < n; i++) {
            register int a, b;
            read(a), read(b);
            changeCard(init, getid(a), 1);
        }
        h.clear();
        ans = INT_MAX;
        dfs(init);
        cout << ans << "\n";
    }
    return 0;
}
```
### 数据加强版正解
来自Claris
``` cpp
#include <bits/stdc++.h>
using namespace std;
char ch;
inline void read(int &x) {
    x = 0;
    do ch = getchar(); while (!isdigit(ch));
    while (isdigit(ch)) x = (x << 1) + (x << 3) + (ch ^ '0'), ch = getchar();
}
int T, n, i, x, y, ans, a[15], b[5], A, B, C, D, f[16][16][16][16];
struct Card {
    int a, b, c, d;
    Card() : a(0), b(0), c(0), d(0) {}
    Card(int a, int b, int c, int d) : a(a), b(b), c(c), d(d) {}
    inline Card operator + (const Card &x) {
        return Card(a + x.a, b + x.b, c + x.c, d + x.d);
    }
} g1[4], g2[3], g3[2], g4;
inline void up(int &a, int b) {
    if (a > b) a = b;
}
inline int get(Card x) {
    if (x.a < 0 || x.b < 0 || x.c < 0|| x.d < 0) return 30;
    if (x.a > 15|| x.b > 15|| x.c > 15|| x.d > 15) return 30;
    if(~f[x.a][x.b][x.c][x.d]) return f[x.a][x.b][x.c][x.d];
    int t = 30;
    for (int i = 0; i < 4; i++) up(t, get(x + g1[i]));
    for (int i = 0; i < 3; i++) up(t, get(x + g2[i]));
    for (int i = 0; i < 2; i++) up(t, get(x + g3[i]));
    up(t, get(x + g4));
    for (int i = 0; i < 4; i++)
        for(int j = 0; j < 2; j++)
            up(t, get(x + g1[i] + g3[j]));
    for (int i = 0; i < 3; i++)
        for(int j = 0; j < 2; j++)
            up(t, get(x + g2[i] + g3[j]));
    for (int i = 0; i < 4; i++)
        for(int j = 0; j < 4; j++)
            up(t, get(x + g4 + g1[i] + g1[j]));
    for (int i=0; i < 3; i++)
        up(t, get(x + g4 + g2[i]));
    for (int i=0; i < 3; i++)
        for(int j = 0; j < 3; j++)
            up(t, get(x + g4 + g2[i] + g2[j]));
    up(t, get(x + g4 + g4));
    return f[x.a][x.b][x.c][x.d] = t + 1;
}
inline int cal() {
    for (int i = 2; i <= 4; i++) b[i] = 0;
    b[1] = a[0];
    for (int i = 1; i <= 13; i++) b[a[i]]++;
    return get(Card(b[1], b[2], b[3], b[4]));
}
void dfs(int x) {
    if (ans &&x >= ans)return;
    x++;
    for (int i = 2; i <= 12; i++) {
        if (a[i] >= 3) {
            int j = i;
            while (a[j + 1] >= 3) j++;
            for (int k = j; k > i; k--) {
                for (int o = i; o <= k; o++) a[o] -= 3;
                dfs(x);
                for (int o = i; o <= k; o++) a[o] += 3;
            }
        }
    }
    for (int i = 2; i <= 11; i++) {
        if (a[i] >= 2) {
            int j = i;
            while (a[j + 1] >= 2) j++;
            for(int k = j; k > i + 1; k--) {
                for(int o = i; o <= k; o++) a[o] -= 2;
                dfs(x);
                for(int o = i; o <= k; o++) a[o] += 2;
            }
        }
    }
    for(int i = 2; i <= 9; i++) {
        if(a[i]) {
            int j = i;
            while(a[j + 1]) j++;
            for(int k = j; k > i + 3; k--) {
                for(int o = i; o <= k; o++) a[o]--;
                dfs(x);
                for(int o = i; o <= k; o++) a[o]++;
            }
        }
    }
    int tmp = cal() + x - 1;
    if(!ans || tmp < ans) ans = tmp;
}
int main() {
    for(A = 0; A < 16; A++)
        for(B = 0; B < 16; B++)
            for(C = 0; C < 16; C++)
                for(D = 0; D < 16; D++)
                    f[A][B][C][D] = -1;
    f[0][0][0][0]=0;
    g1[0] = Card(-1, 0, 0, 0);
    g1[1] = Card(1, -1, 0, 0);
    g1[2] = Card(0, 1, -1, 0);
    g1[3] = Card(0, 0, 1, -1);
    g2[0] = Card(0, -1, 0, 0);
    g2[1] = Card(1, 0, -1, 0);
    g2[2] = Card(0, 1, 0, -1);
    g3[0] = Card(0, 0, -1, 0);
    g3[1] = Card(1, 0, 0, -1);
    g4 = Card(0, 0, 0, -1);
    for (read(T), read(n); T--; printf("%d\n",ans)) {
        for (ans = i = 0; i <= 13; i++) a[i] = 0;
        for (i = 0; i < n; i++) {
            read(x), read(y);
            if(x == 1) x = 13;
            else if(x) x--;
            a[x]++;
        }
        dfs(0);
        if(a[0] == 2) a[0] = 0, dfs(1);
    }
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=730607&auto=1&height=66"></iframe>
