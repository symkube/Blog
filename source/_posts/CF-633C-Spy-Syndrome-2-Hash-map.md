---
title: 「CF-633C」Spy Syndrome 2-Hash+map
date: 2017-01-02 16:59:15
tags:
  - Hash
  - map
  - 字符串
categories:
  - oi
  - 字符串
---
After observing the results of Spy Syndrome, Yash realised the errors of his ways. He now believes that a super spy such as Siddhant can't use a cipher as basic and ancient as Caesar cipher. After many weeks of observation of Siddhant’s sentences, Yash determined a new cipher technique.

For a given sentence, the cipher is processed as:
<!-- more -->
1. Convert all letters of the sentence to lowercase.
2. Reverse each of the words of the sentence individually.
3. Remove all the spaces in the sentence.

For example, when this cipher is applied to the sentence

Kira is childish and he hates losing

the resulting string is
``` bash
ariksihsidlihcdnaehsetahgnisol
```
Now Yash is given some ciphered string and a list of words. Help him to find out any original sentence composed using only words from the list. Note, that any of the given words could be used in the sentence multiple times.
### 链接
[CF-633C](http://codeforces.com/problemset/problem/633/C)
### 题解
Hash 后加 map 里，暴力匹配即可，~~不需要用 Trie 树~~
### 代码
``` cpp
#include <bits/stdc++.h>
typedef long long ll;
const ll p = 31;
std::string s;
std::map<ll, std::string> hash;
ll a[100100];
int n, m;
inline void print(int n) {
    if (!n) return;
    const std::string &str = hash[a[n]];
    print(n - str.size());
    std::cout << str << " ";
}
inline void solve() {
    ll h = 0;
    for (register int i = 0; i < m; i++) {
        std::string w;
        std::cin >> w;
        h = 0;
        for (register int j = 0; j < w.size(); j++) h = h * p + tolower(w[j]);
        hash[h] = w;
    }
    std::fill(a, a + n, -1);
    a[0] = 0;
    for (register int i = 0; i < n; i++) {
        h = 0;
        for (register int j = i; j >= 0; j--) {
            h = (h * p + s[j]);
            if (a[j] != -1 && hash.count(h)) {
                a[i + 1] = h;
                break;
            }
        }
    }
    print(n);
}
int main() {
    std::cin >> n >> s >> m;
    solve();
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=413077069&auto=1&height=66"></iframe>
