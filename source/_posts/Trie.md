---
title: Trie 学习笔记
date: 2016-06-26 12:09:35
tags:
  - oi
  - 学习笔记
  - 字符串
  - Trie
catrgories: 
  - oi
  - 学习笔记
---
## Trie 树(c++实现)
### 原理
Trie 树，又称单词查找树，是一种树形结构，是一种哈希树的变种。典型应用是用于统计，排序和保存大量的字符串（但不仅限于字符串），所以经常被搜索引擎系统用于文本词频统计。它的优点是：利用字符串的公共前缀来减少查询时间，最大限度地减少无谓的字符串比较，查询效率比哈希树高。
详见 [Trie 树](https://en.wikipedia.org/wiki/Trie)
<!-- more -->
### 应用
 trie树又称单词查找树，典型的应用是用于统计，排序和保存大量的字符串（不仅用于字符串），所以经常被搜索引擎系统用于文本词频的统计。
### 实现
``` cpp
/*********************trie********************
 *created by xehoth 26/06/2016              
 *@author xehoth                           
 *trie树的c++实现                           
 *充分利用列表初始化,模板和析构函数              
 *高级:减少空间消耗,请参考DoubleArrayTrie          
 *********************************************
 */
#include <iostream>
#include <cstring>
using namespace std;

template<int Size>
class trieNode{
    public:
        trieNode() : terminableSize(0), nodeSize(0) { for(int i = 0; i < Size; ++i) children[i] = NULL; }
        ~trieNode(){
            for(int i = 0; i < Size; ++i){
                delete children[i];
                children[i] = NULL;
            }
        }
    public:
        /* terminableNum存储以此结点为结束结点的个数，*/
        /*这样可以避免删除时，不知道是否有多个相同字符串的情况*/
        int terminableSize;/* 存储以此结点为结尾的字串的个数*/
        int nodeSize;/*记录此结点孩子的个数*/
        /* 字母的存储并不是存储的字母，而是存储的位置，*/
        /*如果该位置的指针为空，则说明此处没有字母；反之有字母*/
        trieNode* children[Size];/*该数组记录指向孩子的指针*/
};

template<int Size, class Type>
class trie{
    public:
        /*初始化root*/
        typedef trieNode<Size> Node;
        typedef trieNode<Size>* pNode;
        trie() : root(new Node) {}
        /*插入*/
        template<class Iterator>
        void insert(Iterator beg, Iterator end);
        void insert(const char *str);
        /*查找*/
        template<class Iterator>
        bool find(Iterator beg, Iterator end);
        bool find(const char *str);
        /*删除一个节点*/
        template<class Iterator>
        bool downNodeAlone(Iterator beg);
        /*删除区域*/
        template<class Iterator>
        bool erase(Iterator beg, Iterator end);
        bool erase(const char *str);
        /*整个大小*/
        int sizeAll(pNode);
        /*去掉多余后的大小*/
        int sizeNoneRedundant(pNode);
    public:
        /*根节点*/
        pNode root;
    private:
        Type index;
};

template<int Size, class Type>
template<class Iterator>
void trie<Size, Type>::insert(Iterator beg, Iterator end){
    pNode cur = root;
    pNode pre;
    for(; beg != end; ++beg){
        if(!cur->children[index[*beg]]){
            cur->children[index[*beg]] = new(Node);
            ++cur->nodeSize;
        }
        pre = cur;
        cur = cur->children[index[*beg]];
    }
    ++pre->terminableSize;
}
template<int Size, class Type>
void trie<Size, Type>::insert(const char *str){
    return insert(str, str + strlen(str));
}

template<int Size, class Type>
template<class Iterator>
bool trie<Size, Type>::find(Iterator beg, Iterator end){
    pNode cur = root;
    pNode pre;
    for(; beg != end; ++beg){
        if(!cur->children[index[*beg]]){
            return false;
            break;
        }
        pre = cur;
        cur = cur->children[index[*beg]];
    }
    if(pre->terminableSize > 0)
        return true;
    return false;
}

template<int Size, class Type>
bool trie<Size, Type>::find(const char *str){
    return find(str, str + strlen(str));
}

template<int Size, class Type>
template<class Iterator>
bool trie<Size, Type>::downNodeAlone(Iterator beg){
    pNode cur = root;
    int terminableSum = 0;
    while(cur->nodeSize != 0){
        terminableSum += cur->terminableSize;
        if(cur->nodeSize > 1)
            return false;
        else{
            for(int i = 0; i < Size; ++i){
                if(cur->children[i])
                    cur = cur->children[i];
            }
        }
    }
    if(terminableSum == 1)
        return true;
    return false;
}
template<int Size, class Type>
template<class Iterator>
bool trie<Size, Type>::erase(Iterator beg, Iterator end){
    if(find(beg, end)){
        pNode cur = root;
        pNode pre;
        for(; beg != end; ++beg){
            if(downNodeAlone(cur)){
                delete cur;
                return true;
            }
            pre = cur;
            cur = cur->children[index[*beg]];
        }
        if(pre->terminableSize > 0)
            --pre->terminableSize;
        return true;
    }
    return false;
}

template<int Size, class Type>
bool trie<Size, Type>::erase(const char *str){
    if(find(str)){
        erase(str, str + strlen(str));
        return true;
    }
    return false;
}

template<int Size, class Type>
int trie<Size, Type>::sizeAll(pNode ptr){
    if(ptr == NULL)
        return 0;
    int rev = ptr->terminableSize;
    for(int i = 0; i < Size; ++i)
        rev += sizeAll(ptr->children[i]);
    return rev;
}

template<int Size, class Type>
int trie<Size, Type>::sizeNoneRedundant(pNode ptr){
    if(ptr == NULL)
        return 0;
    int rev = 0;
    if(ptr->terminableSize > 0)
        rev = 1;
    if(ptr->nodeSize != 0){
        for(int i = 0; i < Size; ++i)
            rev += sizeNoneRedundant(ptr->children[i]);
    }
    return rev;
}
/*这个是用来构建索引的类,根据实际情况自行修改*/
template<int Size>
class Index{
    public:
  /*对于数字*//*int operator[](char vchar) { return vchar-'0'; }*/ 
  /*对于字母*/int operator[](char vchar) { return vchar % Size; }
};
int main(int argc, char const *argv[]){
    /* code */
    return 0;
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=691504&auto=1&height=66"></iframe>