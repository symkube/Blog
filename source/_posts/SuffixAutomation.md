---
title: 后缀自动机学习笔记
date: 2017-03-12 13:34:09
tags:
  - 字符串
  - 后缀自动机
  - 学习笔记
categories:
  - oi
  - 学习笔记
---
## 后缀自动机学习总结
### 前置技能
#### 有限状态自动机
有限状态自动机 [DFA](https://en.wikipedia.org/wiki/Deterministic_finite_automaton)，功能就是识别字符串，令一个自动机 $A$，若能识别字符串 $S$，就记为 $A(S) = true$，否则 $A(S) = false$。自动机由五个部分组成，$alpha$ 为字符集，$state$ 状态集合，$init$ 初始状态，$end$ 结束状态集合，$trans$ 状态转移函数。

$tarns(s, ch)$ 表示当前状态是 $s$，在读入后字符 $ch$ 后所到达的状态；同时 $tarns(s, str)$ 表示当前状态是 $s$，在读入后字符串 $str$ 后所到达的状态。

如果 $trans(s, ch)$ 这个转移不存在，我们设其为 `null`，同时 `null` 只能转移到 `null`，`null` 表示不存在的状态。
<!-- more -->
### 定义
Suffix Automaton, 顾名思义就是可以识别 Suffix 的 Automaton, [A short guide to suffix automata - Codeforces](http://codeforces.com/blog/entry/20861) 中有如下的描述:

A **suffix automaton** A for a string s is a minimal finite automaton that recognizes the suffixes of s. This means that A is a directed acyclic graph with an initial node i, a set of terminal nodes, and the arrows between nodes are labeled by letters of s. To test whether w is a suffix of s it is enough to start from the initial node of i and follow the arrows corresponding to the letters of w. If we are able to do this for every letter of w and end up in a terminal node, w is a suffix of s.

也就是说对给定字符串 $s$ 的后缀自动机是一个最小化确定有限状态自动机，它能够接收字符串 $s$ 的所有后缀。

- 后缀自动机是一张有向无环图，其中顶点是状态，而边代表了状态之间的转移。
- 某一状态 $t_0$ 被称作初始状态，由它能够到达其余所有状态。
- 自动机中的所有转移——即有向边——都被某种符号标记。从某一状态出发的诸转移必须拥有不同的标记。
- 一个或多个状态被标记为终止状态。如果我们从初始状态 $t_0$ 经由任意路径走到某一终止状态，并顺序写出所有经过边的标记，你得到的字符串必然是 $s$ 的某一后缀。
- 在符合上述诸条件的所有自动机中，后缀自动机有这最少的顶点数。

#### 一些定义
- $max$：它表示该状态能够接受的最长的字符串长度。
- $min$：表示该状态能够接受的最短的字符串长度。
- $max - min + 1$：表示该状态能够接受的不同的字符串数。

### 状态
#### 一些定义
给定字符串 $T$ 与 $s$，定义 $endpos(T, s) = \left \{end | T \left [ begin : end \right ] = s \right \}$，即所有在 $T$ 中出现的 $s$ 的结束位置的下标，如果有两个字符串 $s_1$ 和 $s_2$，若 $endpos(T, s_1) = endpos(T, s_2)$，则 $s_1$ 和 $s_2$ 是 $endpos$ 等效的($endpos-equivalent$)。

#### 子串
对于 $T$ 的两个任意子串 $s_1$ 和 $s_2$，假设 $length(s_1) < length(s_2)$，如果 $endpos(s_1) \cap endpos(s_2) \neq \varnothing$，也就是说 $s_1$ 与 $s_2$ 至少会同时以 $T$ 某个字符作为结尾，即 $s_1$ 是 $s_2$ 的后缀。
显然，若 $s_1$ 是 $s_2$ 的后缀，则 $endpos(s_1) \supseteq endpos(s_2)$。

#### 状态
对于一个状态 $u$ 定义:
- $longest(u)$: $substrings(u)$ 中最长的 $substring$
- $shortest(u)$: $substrings(u)$ 中最短 $substring$
- $maxlen(u)$: $longest(u)$ 的长度
- $minlen(u)$: $shortest(u)$ 的长度

即对于一个 $endpos(s)$ 适合它的子串的长度在一个范围内 $\left [ minlen(s), maxlen(s) \right ]$，对于任意两个状态 $a, b$，$endpos(a)$ 和 $endpos(b)$ 如果相交，设 $max(a) < min(b)$，那么 $endpos(b)$ 是 $endpos(a)$ 的真子集，否则不相交。

### SuffixLink
$endpos$ 集合的包含关系形成的树形结构叫做 $SuffixLink$ 或者 $ParentTree$ 或者 $FailTree$，这个边是从孩子指向父亲的，$SuffixLink$ 从上往下 $endpos$ 集合变小，子串长度变长

$fa = Parent(s) \rightarrow endpos(s) \subset endpos(fa)$ 且 $endpos(fa)$ 最小。

发现 $max(fa) = min(s) - 1$。

$SuffixLink$ 的叶子节点数 $O(n)$，每个内部节点至少两个孩子，所以总结点数 $O(n)$  

### 一些性质

1. $min$ 实际上等于该状态的 $fa$ 指针指向的结点的 $max + 1$。

2. $max(s)$ 也表示了 $SAM$ 上 $root$ 到 $s$ 最多走几步，从 $root$ 到 $s$ 的所有路径范围就是 $\left [ min(s), max(s) \right ]$，也就是 $( max(fa), max(s) ]$，因为一条路径就是一个能转移到 $s$ 状态的子串。

3. 在 $SAM$ 中节点数不超过 $2n - 2$，边数不超过 $3n - 3$。

4. $SuffixLink$ 从父亲指向儿子后就是 $reverse(s)$ 的 $Suffix Tree$ 即反向字符串的后缀树(也是原串的反向前缀树)，后缀树是一颗经过压缩的字典树。

5. 两个串的最长公共后缀,位于这两个串对应状态在 $SuffixLink$ 上的最近公共祖先状态。

6. 从 $init$ 开始走转移边可以得到所有子串，每个子串都必然包含在 $SAM$ 的某个状态里一个状态的 $endpos$ 集合就是他的子树(叶子)的 $endpos$ 的并集，换句话说在 $SuffixLink$ 中，每个状态的 $endpos$ 集合是它父状态的 $endpos$ 集合的子集。

7. $SuffixLink$ 的拓扑序：序列中第 $i$ 个状态的子结点必定在它之后，父结点必定在它之前。

8. 每个状态 $s$ 代表的所有串在原串中的出现次数和每次出现的右端点相同。

### 构造
增量构造，详见文末参考资料。

### 实现
代码很短......
``` cpp
namespace SuffixAutomation {

struct Node {
    Node *fa, *next[26];
    int max;
    Node(int max = 0) : max(max), fa(NULL) {
     /*   memset(next, 0, sizeof(next)); */
    }
    
    Node(int max, Node *p) {
        *this = *p, this->max = max;
    }
    inline void *operator new(size_t);
} pool[MAXN], *cur = pool, *root, *last;

inline void *Node::operator new(size_t) {
    return cur++;
}

inline Node *extend(int c, Node *p) {
    Node *np = new Node(p->max + 1);
    while (p && !p->next[c]) p->next[c] = np, p = p->fa;
    if (!p) {
        np->fa = root;
    } else {
        Node *q = p->next[c];
        if (p->max + 1 == q->max) {
            np->fa = q;
        } else {
            Node *nq = new Node(p->max + 1, q);
            q->fa = np->fa = nq;
            while (p && p->next[c] == q) p->next[c] = nq, p = p->fa;
        }
    }
    return np;
}

}
```

### 参考资料
- [Suffix Automaton Tutorial](https://huntzhan.org/suffix-automaton-tutorial/)
- [CLJ PPT](http://wenku.baidu.com/link?url=CR-UUuJ_0my3skfXzE69PoEA5eaIs6KXI_tFUuJiCrYzD77eADSDi61rDDTzIfs6z62r3iivSOYLHNvBLS6SP9jBt1CjsGuxFbGwcRJ-rgq)
- [MAXimal :: algo :: Суффиксный автомат. Построение и применения](http://e-maxx.ru/algo/suffix_automata)
- [后缀自动机的构建及应用](http://blog.csdn.net/wmdcstdio/article/details/44780707)

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=786262&auto=1&height=66"></iframe>