---
title: 「补档计划」矩阵乘法及其优化
date: 2017-04-20 10:48:40
tags:
  - 补档计划
  - 矩阵乘法
  - 黑科技
categories:
  - OI
  - 补档计划
---
矩阵相乘最重要的方法是一般矩阵乘积。它只有在第一个矩阵的列数（column）和第二个矩阵的行数（row）相同时才有意义，这里给出常见的几种实现方式，以及它们性能的比较，然后再给出几种优化，这里的优化是针对 $O(n^3)$ 朴素矩阵乘法的优化，因为朴素算法更容易利用硬件进行优化。
<!-- more -->

### 定义
{% raw %}$(AB)_{ij} = \sum_{k = 1}^{p}a_{ik}b_{kj}${% endraw %}
### 一般实现
**这里假设已开启 $O2$ 优化降维，否则请自行将下面实现中的二维数组降为一维，以免出现性能问题。**
#### i, j, k 式
``` cpp
inline void mul(uint a[MAXN][MAXN], uint b[MAXN][MAXN], uint c[MAXN][MAXN]) {
    for (register int i = 0; i < n; i++) {
        for (register int j = 0; j < n; j++) {
            for (register int k = 0; k < n; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }   
    }
}
```
#### i, k, j 式
``` cpp
inline void mul(uint a[MAXN][MAXN], uint b[MAXN][MAXN], uint c[MAXN][MAXN]) {
    for (register int i = 0; i < n; i++) {
        for (register int k = 0; k < n; k++) {
            for (register int j = 0; j < n; j++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }   
    }
}
```
#### k, i, j 式
``` cpp
inline void mul(uint a[MAXN][MAXN], uint b[MAXN][MAXN], uint c[MAXN][MAXN]) {
    for (register int k = 0; k < n; k++) {
        for (register int i = 0; i < n; i++) {
            for (register int j = 0; j < n; j++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }   
    }
}
```
#### k, j, i 式
``` cpp
inline void mul(uint a[MAXN][MAXN], uint b[MAXN][MAXN], uint c[MAXN][MAXN]) {
    for (register int k = 0; k < n; k++) {
        for (register int j = 0; j < n; j++) {
            for (register int i = 0; i < n; i++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }   
    }
}
```
#### j, i, k 式
``` cpp
inline void mul(uint a[MAXN][MAXN], uint b[MAXN][MAXN], uint c[MAXN][MAXN]) {
    for (register int j = 0; j < n; j++) {
        for (register int i = 0; i < n; i++) {
            for (register int k = 0; k < n; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }   
    }
}
```
#### j, k, i 式
``` cpp
inline void mul(uint a[MAXN][MAXN], uint b[MAXN][MAXN], uint c[MAXN][MAXN]) {
    for (register int j = 0; j < n; j++) {
        for (register int k = 0; k < n; k++) {
            for (register int i = 0; i < n; i++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }   
    }
}
```
#### 性能测试
针对以上 $6$ 种实现方式，分别进行单元测试和在 $OJ$ 中测试结果均为 i, k, j 式效率最高。
可在 [THOJ-46](http://thoj.xehoth.cc/problem/46) 测试矩阵乘法性能。
#### 分析
i, k, j 式性能最高在于访问的连续性，虽然大矩阵无法装入缓存，但这种写法仍然是对缓存友好的。
## 优化
### 一般优化
#### 对于 0 的优化
假设这里已经使用 i, k, j 式实现，若矩阵中 $0$ 数量较多，可以剪枝，**注意** 若 $0$ 数量太多，请消除分支预测。
``` cpp
inline void mul(uint a[MAXN][MAXN], uint b[MAXN][MAXN], uint c[MAXN][MAXN]) {
    for (register int i = 0; i < n; i++) {
        for (register int k = 0; k < n; k++) {
            if (a[i][k]) {
                for (register int j = 0; j < n; j++) {
                    c[i][j] += a[i][k] * b[k][j];
                }
            }
        }   
    }
}
```
#### 消除分支预测 + 寻址优化
用指针对二维数组寻址，对于上个优化消除分支预测。
``` cpp
inline void mul(uint a[MAXN][MAXN], uint b[MAXN][MAXN], uint c[MAXN][MAXN], int i, int k) {
    for (register uint tmp = a[i][k], *p1 = c[i], *p2 = b[k], *r = p1 + n; p1 != r; p1++, p2++)
        *p1 += tmp * *p2;
}

inline void mul(uint a[MAXN][MAXN], uint b[MAXN][MAXN], uint c[MAXN][MAXN]) {
    for (register int i = 0; i < n; i++) {
        for (register int k = 0; k < n; k++) {
            a[i][k] ? (optimzeMul(a, b, c, i, k), 0) : 0;
        }
    }
}
```
### 中级优化
#### 分块矩乘
既然矩阵太大，缓存装不下，我们分块乘就好了啊，这个在加三个循环就好了，代码路。
#### prefetch
既然我们使用 g++ 编译，那么 `__builtin_prefetch` 不是很好用吗？
访问前加上 `prefetch`，其他什么区别都没有，代码略。
#### 矩阵转置
有人说我就喜欢写 i, j, k 式，这时我们只需要将 $B$ 矩阵转置后再相乘就对缓存友好了。
这里附上暴力转置的代码(矩阵太小会没有任何优势，而且最好使用原地转置)。
``` cpp
inline void mul(uint a[MAXN][MAXN], uint b[MAXN][MAXN], uint c[MAXN][MAXN]) {
    static uint tmp[MAXN][MAXN];
    for (register int i = 0; i < n; i++)
        for (register int j = 0; j < n; j++)
            tmp[i][j] = b[j][i];
    for (register int j = 0; j < n; j++) {
        for (register int i = 0; i < n; i++) {
            for (register int k = 0; k < n; k++) {
                c[i][j] += a[i][k] * tmp[j][k];
            }
        }   
    }
}
```
### 高级优化
#### CPU 并发
使用了上面的矩阵转置的 i, j, k 式并不会比 i, k, j 式快，既然说了矩阵转置，那肯定是有用的，注意到转置后的矩阵乘法变为了 $c[i][j] += a[i][k] * b[j][k]$。
其中 $c[i][j]$ 对于第三重循环不变，那么我们可以单独开一个临时变量放进寄存器，累加完后赋给 $c[i][j]$。
有注意到 $a[i][k], b[j][k]$ 的第二维同时变化，第一维相当于不变，那么这时就可以用到大量循环展开刺激 CPU 并发的技巧，关于 CPU 并发详见我[关于常数优化的总结](https://blog.xehoth.cc/2017/03/31/%E5%B8%B8%E6%95%B0%E4%BC%98%E5%8C%96%E7%9A%84%E6%8A%80%E5%B7%A7%E5%8F%8A%E5%BA%94%E7%94%A8/)，看了这个就能仿照 `CodeChef-COUNTARI` 的代码写出来了。
#### SSE 优化使用 SIMD 指令集
内联汇编虽然好，但容易被干掉，那我们使用 SIMD 指令集就好了啊。
这里给出 $16 \times 16$ 矩阵乘法的 SIMD 指令集优化，大矩阵就分块调用就好了。
我曾在 codeforces 上使用分块 + 刺激 CPU 并发 + SSE 优化在 $3s$ 内跑了一个 $5000 \times 5000$ 的矩阵乘法....
``` cpp
#include <immintrin.h>
#include <intrin.h>
#define DIFFERENT_ORDER 0
 
static inline void lincomb_SSE(const float *a, const __m128 b[4], float *out) {
    __m128 result;
    __m128 column = _mm_load_ps(a);
    result = _mm_mul_ps(_mm_shuffle_ps(column, column, 0x00), b[0]);
    result = _mm_add_ps(result, _mm_mul_ps(_mm_shuffle_ps(column, column, 0x55), b[1]));
    result = _mm_add_ps(result, _mm_mul_ps(_mm_shuffle_ps(column, column, 0xaa), b[2]));
    result = _mm_add_ps(result, _mm_mul_ps(_mm_shuffle_ps(column, column, 0xff), b[3]));
    _mm_store_ps(out, result);
}
 
void matmult_SSE(float *A, const float *B) {
    _MM_ALIGN16 float mA[16], mB[16];
#if DIFFERENT_ORDER
    float *out = mA;
    memcpy(mA, A, 16 * sizeof(float));
    memcpy(mB, B, 16 * sizeof(float));
#else
    _MM_ALIGN16 float out[16];
    memcpy(mB, A, 16 * sizeof(float));
    memcpy(mA, B, 16 * sizeof(float));
#endif
    __m128 Bcolumns[] = { 
        _mm_load_ps(mB + 0),
        _mm_load_ps(mB + 4),
        _mm_load_ps(mB + 8),
        _mm_load_ps(mB + 12)
    };
    lincomb_SSE(mA + 0,  Bcolumns, out + 0);
    lincomb_SSE(mA + 4,  Bcolumns, out + 4);
    lincomb_SSE(mA + 8,  Bcolumns, out + 8);
    lincomb_SSE(mA + 12, Bcolumns, out + 12);
    memcpy(A, out, 16 * sizeof(float));
}
```
### 终极优化
以下优化在 OI 应该无法用到....
#### 并行
MPI 实现的网上已经很多，这里使用 openmp 实现
``` cpp
#include <omp.h>
#include <cstdlib>
#include <ctime>
#include <iostream>

const int MatrixOrder = 1024;
const double FactorIntToDouble = 1.1;

double firstParaMatrix[MatrixOrder][MatrixOrder];
double secondParaMatrix[MatrixOrder][MatrixOrder];
double matrixMultiResult[MatrixOrder][MatrixOrder];

inline double calcuPartOfMatrixMulti(int row, int col) {
    double resultValue = 0;
    for (register int transNumber = 0; transNumber < MatrixOrder;
         transNumber++) {
        resultValue += firstParaMatrix[row][transNumber] *
                       secondParaMatrix[transNumber][col];
    }
    return resultValue;
}

inline void matrixInit() {
#pragma omp parallel for num_threads(64)
    for (register int row = 0; row < MatrixOrder; row++) {
        for (register int col = 0; col < MatrixOrder; col++) {
            srand(row + col);
            firstParaMatrix[row][col] = (rand() % 10) * FactorIntToDouble;
            secondParaMatrix[row][col] = (rand() % 10) * FactorIntToDouble;
        }
    }
    /* #pragma omp barrier */
}

inline void matrixMulti() {
#pragma omp parallel for num_threads(64)
    for (register int row = 0; row < MatrixOrder; row++) {
        for (register int col = 0; col < MatrixOrder; col++) {
            matrixMultiResult[row][col] = calcuPartOfMatrixMulti(row, col);
        }
    }
    /* #pragma omp barrier */
}

int main() {
    matrixInit();
    clock_t t1 = clock();
    matrixMulti();
    clock_t t2 = clock();
    std::cout << "time: " << t2 - t1 << std::endl;
    return 0;
}
```
#### CUDA
这里利用 GPU 进行矩阵乘法，代码来自 [github](https://github.com/chaolongzhang/algorithms-cuda/blob/master/matrixMul/matrixMul.cu)
``` cpp
/**
 * This code copy from the matrixMul Sample of CUDA Samples and do some
 * modification:
 * 1. Add a kernel matrixMulCUDA_NonShared()
 * 2. Line 230 and 280 add `matrixMulCUDA_NonShared <<< grid, threads >>> (d_C,
 * d_A, d_B, dimsA.x, dimsB.x);`
 * 3. Ahange nIter from 300 into 3
 * 4. Line 424 add for (int width = 256; width <= 2048; width += 256)
 *
 * Copyright 1993-2015 NVIDIA Corporation.  All rights reserved.
 *
 * Please refer to the NVIDIA end user license agreement (EULA) associated
 * with this source code for terms and conditions that govern your use of
 * this software. Any use, reproduction, disclosure, or distribution of
 * this software and related documentation outside the terms of the EULA
 * is strictly prohibited.
 *
 */

/**
 * Matrix multiplication: C = A * B.
 * Host code.
 *
 * This sample implements matrix multiplication as described in Chapter 3
 * of the programming guide.
 * It has been written for clarity of exposition to illustrate various CUDA
 * programming principles, not with the goal of providing the most
 * performant generic kernel for matrix multiplication.
 *
 * See also:
 * V. Volkov and J. Demmel, "Benchmarking GPUs to tune dense linear algebra,"
 * in Proc. 2008 ACM/IEEE Conf. on Supercomputing (SC '08),
 * Piscataway, NJ: IEEE Press, 2008, pp. Art. 31:1-11.
 */

/* System includes */
#include <assert.h>
#include <stdio.h>

/* CUDA runtime */
#include <cuda_runtime.h>

/* Helper functions and utilities to work with CUDA */
#include <helper_cuda.h>
#include <helper_functions.h>

/**
 * Matrix multiplication (CUDA Kernel) on the device: C = A * B
 * wA is A's width and wB is B's width
 */
template <int BLOCK_SIZE>
__global__ void matrixMulCUDA(float *C, float *A, float *B, int wA, int wB) {
    /* Block index */
    int bx = blockIdx.x;
    int by = blockIdx.y;

    /* Thread index */
    int tx = threadIdx.x;
    int ty = threadIdx.y;

    /* Index of the first sub-matrix of A processed by the block */
    int aBegin = wA * BLOCK_SIZE * by;

    /* Index of the last sub-matrix of A processed by the block */
    int aEnd = aBegin + wA - 1;

    /* Step size used to iterate through the sub-matrices of A */
    int aStep = BLOCK_SIZE;

    /* Index of the first sub-matrix of B processed by the block */
    int bBegin = BLOCK_SIZE * bx;

    /* Step size used to iterate through the sub-matrices of B */
    int bStep = BLOCK_SIZE * wB;

    /* Csub is used to store the element of the block sub-matrix */
    /* that is computed by the thread */
    float Csub = 0;

    /* Loop over all the sub-matrices of A and B */
    /* required to compute the block sub-matrix */
    for (int a = aBegin, b = bBegin; a <= aEnd; a += aStep, b += bStep) {
        /* Declaration of the shared memory array As used to */
        /* store the sub-matrix of A */
        __shared__ float As[BLOCK_SIZE][BLOCK_SIZE];

        /* Declaration of the shared memory array Bs used to */
        /* store the sub-matrix of B */
        __shared__ float Bs[BLOCK_SIZE][BLOCK_SIZE];

        /* Load the matrices from device memory */
        /* to shared memory; each thread loads */
        /* one element of each matrix */
        As[ty][tx] = A[a + wA * ty + tx];
        Bs[ty][tx] = B[b + wB * ty + tx];

        /* Synchronize to make sure the matrices are loaded */
        __syncthreads();

/* Multiply the two matrices together; */
/* each thread computes one element */
/* of the block sub-matrix */
#pragma unroll

        for (int k = 0; k < BLOCK_SIZE; ++k) {
            Csub += As[ty][k] * Bs[k][tx];
        }

        /* Synchronize to make sure that the preceding */
        /* computation is done before loading two new */
        /* sub-matrices of A and B in the next iteration */
        __syncthreads();
    }

    /* Write the block sub-matrix to device memory; */
    /* each thread writes one element */
    int c = wB * BLOCK_SIZE * by + BLOCK_SIZE * bx;
    C[c + wB * ty + tx] = Csub;
}

/**
 * Matrix multiplication (CUDA Kernel) without use shared memory on the device:
 * C = A * B
 * wA is A's width and wB is B's width
 */
__global__ void matrixMulCUDA_NonShared(float *C, float *A, float *B, int wA,
                                        int wB) {
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;

    float sum = 0.0f;
    for (int i = 0; i < wA; ++i) {
        sum += A[x * wA + i] * B[i * wB + y];
    }
    C[y * wB + x] = sum;
}

void constantInit(float *data, int size, float val) {
    for (int i = 0; i < size; ++i) {
        data[i] = val;
    }
}

/**
 * Run a simple test of matrix multiplication using CUDA
 */
int matrixMultiply(int argc, char **argv, int block_size, dim3 &dimsA,
                   dim3 &dimsB) {
    /* Allocate host memory for matrices A and B */
    unsigned int size_A = dimsA.x * dimsA.y;
    unsigned int mem_size_A = sizeof(float) * size_A;
    float *h_A = (float *)malloc(mem_size_A);
    unsigned int size_B = dimsB.x * dimsB.y;
    unsigned int mem_size_B = sizeof(float) * size_B;
    float *h_B = (float *)malloc(mem_size_B);

    /* Initialize host memory */
    const float valB = 0.01f;
    constantInit(h_A, size_A, 1.0f);
    constantInit(h_B, size_B, valB);

    /* Allocate device memory */
    float *d_A, *d_B, *d_C;

    /* Allocate host matrix C */
    dim3 dimsC(dimsB.x, dimsA.y, 1);
    unsigned int mem_size_C = dimsC.x * dimsC.y * sizeof(float);
    float *h_C = (float *)malloc(mem_size_C);

    if (h_C == NULL) {
        fprintf(stderr, "Failed to allocate host matrix C!\n");
        exit(EXIT_FAILURE);
    }

    cudaError_t error;

    error = cudaMalloc((void **)&d_A, mem_size_A);

    if (error != cudaSuccess) {
        printf("cudaMalloc d_A returned error %s (code %d), line(%d)\n",
               cudaGetErrorString(error), error, __LINE__);
        exit(EXIT_FAILURE);
    }

    error = cudaMalloc((void **)&d_B, mem_size_B);

    if (error != cudaSuccess) {
        printf("cudaMalloc d_B returned error %s (code %d), line(%d)\n",
               cudaGetErrorString(error), error, __LINE__);
        exit(EXIT_FAILURE);
    }

    error = cudaMalloc((void **)&d_C, mem_size_C);

    if (error != cudaSuccess) {
        printf("cudaMalloc d_C returned error %s (code %d), line(%d)\n",
               cudaGetErrorString(error), error, __LINE__);
        exit(EXIT_FAILURE);
    }

    /* copy host memory to device */
    error = cudaMemcpy(d_A, h_A, mem_size_A, cudaMemcpyHostToDevice);

    if (error != cudaSuccess) {
        printf("cudaMemcpy (d_A,h_A) returned error %s (code %d), line(%d)\n",
               cudaGetErrorString(error), error, __LINE__);
        exit(EXIT_FAILURE);
    }

    error = cudaMemcpy(d_B, h_B, mem_size_B, cudaMemcpyHostToDevice);

    if (error != cudaSuccess) {
        printf("cudaMemcpy (d_B,h_B) returned error %s (code %d), line(%d)\n",
               cudaGetErrorString(error), error, __LINE__);
        exit(EXIT_FAILURE);
    }

    /* Setup execution parameters */
    dim3 threads(block_size, block_size);
    dim3 grid(dimsB.x / threads.x, dimsA.y / threads.y);

    /* Create and start timer */
    printf("Computing result using CUDA Kernel...\n");

    /* matrixMulCUDA_NonShared <<< grid, threads >>> (d_C, d_A, d_B, dimsA.x,
     * dimsB.x); */

    /* Performs warmup operation using matrixMul CUDA kernel */
    if (block_size == 16) {
        matrixMulCUDA<16><<<grid, threads>>>(d_C, d_A, d_B, dimsA.x, dimsB.x);
    } else {
        matrixMulCUDA<32><<<grid, threads>>>(d_C, d_A, d_B, dimsA.x, dimsB.x);
    }

    printf("done\n");

    cudaDeviceSynchronize();

    /* Allocate CUDA events that we'll use for timing */
    cudaEvent_t start;
    error = cudaEventCreate(&start);

    if (error != cudaSuccess) {
        fprintf(stderr, "Failed to create start event (error code %s)!\n",
                cudaGetErrorString(error));
        exit(EXIT_FAILURE);
    }

    cudaEvent_t stop;
    error = cudaEventCreate(&stop);

    if (error != cudaSuccess) {
        fprintf(stderr, "Failed to create stop event (error code %s)!\n",
                cudaGetErrorString(error));
        exit(EXIT_FAILURE);
    }

    /* Record the start event */
    error = cudaEventRecord(start, NULL);

    if (error != cudaSuccess) {
        fprintf(stderr, "Failed to record start event (error code %s)!\n",
                cudaGetErrorString(error));
        exit(EXIT_FAILURE);
    }

    /* Execute the kernel */
    int nIter = 3;

    for (int j = 0; j < nIter; j++) {
        /* matrixMulCUDA_NonShared <<< grid, threads >>> (d_C, d_A, d_B,
         * dimsA.x, dimsB.x); */

        if (block_size == 16) {
            matrixMulCUDA<16>
                <<<grid, threads>>>(d_C, d_A, d_B, dimsA.x, dimsB.x);
        } else {
            matrixMulCUDA<32>
                <<<grid, threads>>>(d_C, d_A, d_B, dimsA.x, dimsB.x);
        }
    }

    /* Record the stop event */
    error = cudaEventRecord(stop, NULL);

    if (error != cudaSuccess) {
        fprintf(stderr, "Failed to record stop event (error code %s)!\n",
                cudaGetErrorString(error));
        exit(EXIT_FAILURE);
    }

    /* Wait for the stop event to complete */
    error = cudaEventSynchronize(stop);

    if (error != cudaSuccess) {
        fprintf(stderr,
                "Failed to synchronize on the stop event (error code %s)!\n",
                cudaGetErrorString(error));
        exit(EXIT_FAILURE);
    }

    float msecTotal = 0.0f;
    error = cudaEventElapsedTime(&msecTotal, start, stop);

    if (error != cudaSuccess) {
        fprintf(stderr,
                "Failed to get time elapsed between events (error code %s)!\n",
                cudaGetErrorString(error));
        exit(EXIT_FAILURE);
    }

    /* Compute and print the performance */
    float msecPerMatrixMul = msecTotal / nIter;
    double flopsPerMatrixMul =
        2.0 * (double)dimsA.x * (double)dimsA.y * (double)dimsB.x;
    double gigaFlops =
        (flopsPerMatrixMul * 1.0e-9f) / (msecPerMatrixMul / 1000.0f);
    printf(
        "Performance= %.2f GFlop/s, Time= %.3f msec, Size= %.0f Ops, "
        "WorkgroupSize= %u threads/block\n",
        gigaFlops, msecPerMatrixMul, flopsPerMatrixMul, threads.x * threads.y);

    /* Copy result from device to host */
    error = cudaMemcpy(h_C, d_C, mem_size_C, cudaMemcpyDeviceToHost);

    if (error != cudaSuccess) {
        printf("cudaMemcpy (h_C,d_C) returned error %s (code %d), line(%d)\n",
               cudaGetErrorString(error), error, __LINE__);
        exit(EXIT_FAILURE);
    }

    printf("Checking computed result for correctness: ");
    bool correct = true;

    /* test relative error by the formula */
    /*     |<x, y>_cpu - <x,y>_gpu|/<|x|, |y|>  < eps */
    double eps = 1.e-6; /* machine zero */

    for (int i = 0; i < (int)(dimsC.x * dimsC.y); i++) {
        double abs_err = fabs(h_C[i] - (dimsA.x * valB));
        double dot_length = dimsA.x;
        double abs_val = fabs(h_C[i]);
        double rel_err = abs_err / abs_val / dot_length;

        if (rel_err > eps) {
            printf("Error! Matrix[%05d]=%.8f, ref=%.8f error term is > %E\n", i,
                   h_C[i], dimsA.x * valB, eps);
            correct = false;
        }
    }

    printf("%s\n", correct ? "Result = PASS" : "Result = FAIL");

    /* Clean up memory */
    free(h_A);
    free(h_B);
    free(h_C);
    cudaFree(d_A);
    cudaFree(d_B);
    cudaFree(d_C);

    printf(
        "\nNOTE: The CUDA Samples are not meant for performance measurements. "
        "Results may vary when GPU Boost is enabled.\n");

    if (correct) {
        return EXIT_SUCCESS;
    } else {
        return EXIT_FAILURE;
    }
}

/**
 * Program main
 */
int main(int argc, char **argv) {
    printf("[Matrix Multiply Using CUDA] - Starting...\n");

    /* By default, we use device 0, otherwise we override the device ID based on
    what is provided at the command line*/
    int devID = 0;

    cudaError_t error;
    cudaDeviceProp deviceProp;
    error = cudaGetDevice(&devID);

    if (error != cudaSuccess) {
        printf("cudaGetDevice returned error %s (code %d), line(%d)\n",
               cudaGetErrorString(error), error, __LINE__);
    }

    error = cudaGetDeviceProperties(&deviceProp, devID);

    if (deviceProp.computeMode == cudaComputeModeProhibited) {
        fprintf(stderr, "Error: device is running in <Compute Mode Prohibited>,
    no threads can use ::cudaSetDevice().\n");
        exit(EXIT_SUCCESS);
    }

    if (error != cudaSuccess) {
        printf("cudaGetDeviceProperties returned error %s (code %d),
    line(%d)\n", cudaGetErrorString(error), error, __LINE__);
    } else {
        printf("GPU Device %d: \"%s\" with compute capability %d.%d\n\n", devID,
               deviceProp.name, deviceProp.major, deviceProp.minor);
    }

    /* Use a larger block size for Fermi and above */
    int block_size = (deviceProp.major < 2) ? 16 : 32;

    /* test 256 to 2048 step by 256 */
    for (int width = 256; width <= 2048; width += 256) {
        dim3 dimsA(width, width, 1);
        dim3 dimsB(width, width, 1);

        /* width of Matrix A */
        if (checkCmdLineFlag(argc, (const char **)argv, "wA")) {
            dimsA.x = getCmdLineArgumentInt(argc, (const char **)argv, "wA");
        }

        /* height of Matrix A */
        if (checkCmdLineFlag(argc, (const char **)argv, "hA")) {
            dimsA.y = getCmdLineArgumentInt(argc, (const char **)argv, "hA");
        }

        /* width of Matrix B */
        if (checkCmdLineFlag(argc, (const char **)argv, "wB")) {
            dimsB.x = getCmdLineArgumentInt(argc, (const char **)argv, "wB");
        }

        /* height of Matrix B */
        if (checkCmdLineFlag(argc, (const char **)argv, "hB")) {
            dimsB.y = getCmdLineArgumentInt(argc, (const char **)argv, "hB");
        }

        if (dimsA.x != dimsB.y) {
            printf("Error: outer matrix dimensions must be equal. (%d != %d)\n",
                   dimsA.x, dimsB.y);
            exit(EXIT_FAILURE);
        }

        printf("MatrixA(%d,%d), MatrixB(%d,%d)\n", dimsA.x, dimsA.y, dimsB.x,
               dimsB.y);

        int matrix_result =
            matrixMultiply(argc, argv, block_size, dimsA, dimsB);
    }
    exit(0);
}
```
#### 分布式
spark 里已经提供了，使用 Java 和 hadoop 集群，多台计算机分布式计算，适合超大矩阵(如 4000万 \* 4000万)....
代码来自 [Chungtow-Leo](http://blog.csdn.net/xyilu/article/details/9066973)
``` java
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.StringTokenizer;

import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.Writable;
import org.apache.hadoop.io.WritableComparable;
import org.apache.hadoop.mapred.FileSplit;
import org.apache.hadoop.mapred.JobConf;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.Mapper;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.RecordWriter;
import org.apache.hadoop.mapred.Reducer;
import org.apache.hadoop.mapred.Reporter;
import org.apache.hadoop.mapred.TextOutputFormat;
import org.apache.hadoop.mapred.lib.MultipleOutputFormat;
import org.apache.hadoop.util.Progressable;

public class Bigmmult {
    public static final String CONTROL_I = "\u0009";
    public static final int MATRIX_I = 4;
    public static final int MATRIX_J = 3;
    public static final int MATRIX_K = 2;
    
    public static String makeKey(String[] tokens, String separator) {
        StringBuffer sb = new StringBuffer();
        boolean isFirst = true;
        for (String token : tokens) {
            if (isFirst)
                isFirst = false;
            else
                sb.append(separator);
            sb.append(token);
        }
        return sb.toString();
    }
    
    public static class MapClass extends MapReduceBase implements
        Mapper<LongWritable, Text, Text, Text> {         
            public static HashMap<String , Double> features = new HashMap<String, Double>();
           
            public void configure(JobConf job) {
               　super.configure(job);
            }
         
            public void map(LongWritable key, Text value, OutputCollector<Text, Text> output,
                Reporter reporter) throws IOException, ClassCastException {
                /* 获取输入文件的全路径和名称 */
                String pathName = ((FileSplit)reporter.getInputSplit()).getPath().toString();
        
                if (pathName.contains("m_ys_lab_bigmmult_a")) {         
                    String line = value.toString();
                   
                    if (line == null || line.equals("")) return;
                    String[] values = line.split(CONTROL_I);
                   
                    if (values.length < 3) return;
                   
                    String rowindex = values[0];
                    String colindex = values[1];
                    String elevalue = values[2];
                   
                    for (int i = 1; i <= MATRIX_K; i ++) {
                        output.collect(new Text(rowindex + CONTROL_I + i), new Text("a#"+colindex+"#"+elevalue));
                    }
               }
              
                if (pathName.contains("m_ys_lab_bigmmult_b")) {              
                    String line = value.toString();
                    if (line == null || line.equals("")) return;
                    String[] values = line.split(CONTROL_I);
                   
                    if (values.length < 3) return;
                   
                    String rowindex = values[0];
                    String colindex = values[1];
                    String elevalue = values[2];
                   
                    for (int i = 1; i <= MATRIX_I; i ++) {
                         output.collect(new Text(i + CONTROL_I + colindex), new Text("b#"+rowindex+"#"+elevalue));
                    }
               }
          }
     }

     public static class Reduce extends MapReduceBase
               implements Reducer<Text, Text, Text, Text> {
            public void reduce(Text key, Iterator<Text> values,
                OutputCollector<Text, Text> output, Reporter reporter)
                throws IOException {
          
            int[] valA = new int[MATRIX_J];
            int[] valB = new int[MATRIX_J];
          
            int i;
            for (i = 0; i < MATRIX_J; i ++) {
                valA[i] = 0;
                valB[i] = 0;
            }
          
            while (values.hasNext()) {
                String value = values.next().toString();
                if (value.startsWith("a#")) {
                    StringTokenizer token = new StringTokenizer(value, "#");
                    String[] temp = new String[3];
                    int k = 0;
                    while(token.hasMoreTokens()) {
                        temp[k] = token.nextToken();
                        k++;
                    }
                    
                    valA[Integer.parseInt(temp[1])-1] = Integer.parseInt(temp[2]);
                } else if (value.startsWith("b#")) {
                    StringTokenizer token = new StringTokenizer(value, "#");
                    String[] temp = new String[3];
                    int k = 0;
                    while(token.hasMoreTokens()) {
                        temp[k] = token.nextToken();
                        k++;
                    }
                    
                    valB[Integer.parseInt(temp[1])-1] = Integer.parseInt(temp[2]);
                }
            }
          
            int result = 0;
            for (i = 0; i < MATRIX_J; i ++) {
                result += valA[i] * valB[i];
            }
          
            output.collect(key, new Text(Integer.toString(result)));
        }
    }
}
```
<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=692193&auto=1&height=66"></iframe>