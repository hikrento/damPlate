def read_elem():
    input = open('input_elem.txt')
    M = []
    for line in input:
        line = ''.join(line.split()).split(',')
        M.append(line[1:])
    M = np.int64(np.array(M))
    return M

def read_nodes():
    input = open('input_nodes.txt')
    x = []
    y = []

    for line in input:
        line = ''.join(line.split()).split(',')
        x.append(float(line[1]))
        y.append(float(line[2]))
    return x, y


la_20 = 1.45
la_30 = 1.86


x_int, y_int = read_nodes() # координаты узлов
M = read_elem() # матрица соответвий элементов


elem_numbers = np.shape(M)[0]
node_numbers = len(x_int)

# Массив, указывающий теплоемкость каждого элемента
cond_1 = np.ones(elem_numbers)
cond_1[0:185] = la_20
cond_1[185:500] = la_30

# x_elem = np.zeros([elem_numbers, 1])
# y_elem = np.zeros([elem_numbers, 1])

x, xi, xj, xk = sp.symbols('x xi xj xk')
y, yi, yj, yk = sp.symbols('y yi yj yk')

A = sp.Matrix([[1, xi, yi],   # A*R = E
              [1, xj, yj],
              [1, xk, yk]])
P = sp.Matrix([[1, x, y]])
R = A**(-1)     # Матрица коэф-тов функций формы
K_full = np.zeros([node_numbers, node_numbers])
f = np.zeros(node_numbers).T
N = P*R
Ndx = N.diff(x)
Ndy = N.diff(y)
# B = sp.Matrix([[N.diff(x)],
#                 [N.diff(y)]])
for t in range(elem_numbers):
    i, j, k = M[t, 0]-1, M[t, 1]-1, M[t, 2]-1
    N_it = N.subs([(xi, x_int[i]), (xj, x_int[j]), (xk, x_int[k]),
                  (yi, y_int[i]), (yj, y_int[j]), (yk, y_int[k])])

    B = sp.Matrix([[N_it.diff(x)],
                   [N_it.diff(y)]])


    a1 = np.sqrt(np.abs(x_int[i] - x_int[j]) ** 2 + np.abs(y_int[i] - y_int[j]) ** 2)
    a2 = np.sqrt(np.abs(x_int[i] - x_int[k]) ** 2 + np.abs(y_int[i] - y_int[k]) ** 2)
    a3 = np.sqrt(np.abs(x_int[j] - x_int[k]) ** 2 + np.abs(y_int[j] - y_int[k]) ** 2)
    p_h = (a1+a2+a3)/2
    elem_area = np.sqrt(p_h * (p_h - a1) * (p_h - a2) * (p_h - a3))

    Ko = -cond_1[t] * np.array(B.T*B).astype(np.float64)*elem_area

    K_full[i, i] += Ko[0, 0]
    K_full[j, j] += Ko[1, 1]
    K_full[k, k] += Ko[2, 2]
    K_full[i, j] += Ko[0, 1]
    K_full[j, i] = K_full[i, j]
    K_full[i, k] += Ko[0, 2]
    K_full[k, i] = K_full[i, k]
    K_full[j, k] += Ko[1, 2]
    K_full[k, j] = K_full[j, k]

    # x_elem[t] = (x_int[i]+x_int[j]+x_int[k])/3
    # y_elem[t] = (y_int[i]+y_int[j]+y_int[k])/3


# начальные условия
set3_bc1 = np.array([1, 2, 4,   7,   8,   9, 38,  39,  40,  57,  58,  59,  89,  90,  91,  92,
  93,  94,  95,  96,  97,  98,  99, 100, 101, 102, 103, 104, 105])-1
set4_bc2 = np.array([2,  3,  9, 10, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
 26, 27, 28, 29, 30, 31, 32, 33, 34, 86, 87, 88])-1



for i in set3_bc1:
    K_full[i, :] = 0
    K_full[i, i] = 1
    f[i] = 25
for i in set4_bc2:
    K_full[i, :] = 0
    K_full[i, i] = 1
    f[i] = 4


Z = np.dot(np.linalg.inv(K_full), f)
print(Z)



abaqus = pd.read_csv('main/abaqus.csv').to_numpy()[:, -1].T
# results = pd.DataFrame({'abaqus result':abaqus,
#                         'python result':Z,
#                         'calc.error':([Z[i]-abaqus[i] for i in range(len(abaqus))]),
#                         'mean(er)':mean()})
results = pd.DataFrame({'abaqus result':abaqus,
                        'python result':Z,
                        'calc.error':(Z-abaqus),
                        'mean(er)':np.mean(Z-abaqus)})
results.to_excel('results.xlsx')



cm = ColorMap([float(min(Z)), float(max(Z))], [(0,0,255,0), (255,0,0,0)])
fig, ax = plt.subplots()
for i in range(node_numbers):
     color = (str(cm.mapToQColor(float(Z[i])).name()))
     ax.plot(x_int[i], y_int[i], marker = 's', markersize = 9,
             color = color, markeredgecolor = 'black', markeredgewidth = 1)
plt.show()

end = time.time() -start
print(end)
