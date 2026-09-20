#include <stdio.h>
#include <stdlib.h>

#define MAXVEX 9
#define INFINITY 65535

typedef int Patharc[MAXVEX];  // 存放最短路径上的前驱结点
typedef int ShortPathTable[MAXVEX]; // 各节点到源点的最短路径长度

// 邻接矩阵结构
struct MGraph {
    int numVertexes;
    int arc[MAXVEX][MAXVEX];
};

// 邻接表结构
typedef struct EdgeNode {
    int adjvex;
    int weight;
    struct EdgeNode* next;
} EdgeNode;

typedef struct VertexNode {
    int data;
    EdgeNode* firstEdge;
} VertexNode;

typedef struct {
    VertexNode adjList[MAXVEX];
    int numVertexes;
} GraphAdjList;

// 初始化邻接矩阵
void InitMGraph(MGraph* G) {
    G->numVertexes = 9;
    for (int i = 0; i < MAXVEX; ++i) {
        for (int j = 0; j < MAXVEX; ++j) {
            G->arc[i][j] = INFINITY;
            if (i == j) G->arc[i][j] = 0;
        }
    }

    // 设置边权值
    G->arc[0][1] = G->arc[1][0] = 1;
    G->arc[0][2] = G->arc[2][0] = 5;
    G->arc[1][2] = G->arc[2][1] = 3;
    G->arc[1][3] = G->arc[3][1] = 7;
    G->arc[1][4] = G->arc[4][1] = 5;
    G->arc[2][4] = G->arc[4][2] = 1;
    G->arc[2][5] = G->arc[5][2] = 7;
    G->arc[3][4] = G->arc[4][3] = 2;
    G->arc[3][6] = G->arc[6][3] = 3;
    G->arc[4][5] = G->arc[5][4] = 3;
    G->arc[4][6] = G->arc[6][4] = 6;
    G->arc[4][7] = G->arc[7][4] = 9;
    G->arc[5][7] = G->arc[7][5] = 5;
    G->arc[6][7] = G->arc[7][6] = 2;
    G->arc[6][8] = G->arc[8][6] = 7;
    G->arc[7][8] = G->arc[8][7] = 4;
}

// 邻接矩阵的Dijkstra算法
void Dijkstra_Matrix(MGraph* G, int v0, int vv, Patharc P, ShortPathTable D) {
    int found[MAXVEX] = {0};

    for (int v = 0; v < G->numVertexes; ++v) {
        D[v] = G->arc[v0][v];
        P[v] = (D[v] < INFINITY) ? v0 : -1;
    }

    D[v0] = 0;
    found[v0] = 1;
    P[v0] = -1;

    for (int i = 1; i < G->numVertexes; ++i) {
        int min = INFINITY, k = -1;
        for (int w = 0; w < G->numVertexes; ++w) {
            if (!found[w] && D[w] < min) {
                min = D[w];
                k = w;
            }
        }

        if (k == -1) break;
        found[k] = 1;
        if (k == vv) break;

        for (int w = 0; w < G->numVertexes; ++w) {
            if (!found[w] && (min + G->arc[k][w] < D[w])) {
                D[w] = min + G->arc[k][w];
                P[w] = k;
            }
        }
    }

    // 输出路径
    if (D[vv] == INFINITY) {
        printf("Matrix: No path found!\n");
        return;
    }

    int path[MAXVEX], cnt = 0;
    for (int cur = vv; cur != -1; cur = P[cur])
        path[cnt++] = cur;

    printf("Matrix Path: ");
    for (int i = cnt - 1; i >= 0; --i)
        printf(i ? "%d->" : "%d", path[i]);
    printf("\nLength: %d\n\n", D[vv]);
}

// 添加边到邻接表
void AddEdge(GraphAdjList* G, int src, int dest, int weight) {
    EdgeNode* e = (EdgeNode*)malloc(sizeof(EdgeNode));
    e->adjvex = dest;
    e->weight = weight;
    e->next = G->adjList[src].firstEdge;
    G->adjList[src].firstEdge = e;
}

// 初始化邻接表
void InitGraphAdjList(GraphAdjList* G) {
    G->numVertexes = MAXVEX;
    for (int i = 0; i < MAXVEX; ++i) {
        G->adjList[i].data = i;
        G->adjList[i].firstEdge = NULL;
    }

    AddEdge(G, 0, 1, 1); AddEdge(G, 1, 0, 1);
    AddEdge(G, 0, 2, 5); AddEdge(G, 2, 0, 5);
    AddEdge(G, 1, 2, 3); AddEdge(G, 2, 1, 3);
    AddEdge(G, 1, 3, 7); AddEdge(G, 3, 1, 7);
    AddEdge(G, 1, 4, 5); AddEdge(G, 4, 1, 5);
    AddEdge(G, 2, 4, 1); AddEdge(G, 4, 2, 1);
    AddEdge(G, 2, 5, 7); AddEdge(G, 5, 2, 7);
    AddEdge(G, 3, 4, 2); AddEdge(G, 4, 3, 2);
    AddEdge(G, 3, 6, 3); AddEdge(G, 6, 3, 3);
    AddEdge(G, 4, 5, 3); AddEdge(G, 5, 4, 3);
    AddEdge(G, 4, 6, 6); AddEdge(G, 6, 4, 6);
    AddEdge(G, 4, 7, 9); AddEdge(G, 7, 4, 9);
    AddEdge(G, 5, 7, 5); AddEdge(G, 7, 5, 5);
    AddEdge(G, 6, 7, 2); AddEdge(G, 7, 6, 2);
    AddEdge(G, 6, 8, 7); AddEdge(G, 8, 6, 7);
    AddEdge(G, 7, 8, 4); AddEdge(G, 8, 7, 4);
}

// 邻接表的Dijkstra算法
void Dijkstra_AdjList(GraphAdjList* G, int v0, int vv, int* P, int* D) {
    int found[MAXVEX] = {0};

    for (int i = 0; i < G->numVertexes; ++i) {
        D[i] = INFINITY;
        P[i] = -1;
    }
    D[v0] = 0;

    for (int i = 0; i < G->numVertexes; ++i) {
        int min = INFINITY, k = -1;
        for (int j = 0; j < G->numVertexes; ++j) {
            if (!found[j] && D[j] < min) {
                min = D[j];
                k = j;
            }
        }

        if (k == -1) break;
        found[k] = 1;
        if (k == vv) break;

        EdgeNode* e = G->adjList[k].firstEdge;
        while (e) {
            if (!found[e->adjvex] && D[k] + e->weight < D[e->adjvex]) {
                D[e->adjvex] = D[k] + e->weight;
                P[e->adjvex] = k;
            }
            e = e->next;
        }
    }

    // 输出路径
    if (D[vv] == INFINITY) {
        printf("AdjList: No path found!\n");
        return;
    }

    int path[MAXVEX], cnt = 0;
    for (int cur = vv; cur != -1; cur = P[cur])
        path[cnt++] = cur;

    printf("AdjList Path: ");
    for (int i = cnt - 1; i >= 0; --i)
        printf(i ? "%d->" : "%d", path[i]);
    printf("\nLength: %d\n", D[vv]);
}

int main() {
    MGraph g_matrix;
    InitMGraph(&g_matrix);

    Patharc P_matrix;
    ShortPathTable D_matrix;
    printf("邻接矩阵结果:\n");
    Dijkstra_Matrix(&g_matrix, 0, 8, P_matrix, D_matrix);

    GraphAdjList g_adjlist;
    InitGraphAdjList(&g_adjlist);

    int P_adjlist[MAXVEX], D_adjlist[MAXVEX];
    printf("邻接表结果:\n");
    Dijkstra_AdjList(&g_adjlist, 0, 8, P_adjlist, D_adjlist);

    return 0;
}
