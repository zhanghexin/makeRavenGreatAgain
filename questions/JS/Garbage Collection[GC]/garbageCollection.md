可达性

基本的垃圾回收算法称为：标记清除，定期执行以下“垃圾回收”步骤：

* 垃圾回收器获取根并标记它们
* 然后它访问并标记所有来自它们的引用
* 然后它访问标记的对象并标记它们的引用。所有被访问的对象都被记住，以便以后不再访问同一个对象两次
* 以此类推，直到有未访问的引用（可以从根访问）为止
* 除标记的对象外，所有对象都被删除

一些优化：
* 分代回收——对象分为两组：新对象和旧对象。许多对象出现，完成它们的工作并迅速结束，它们很快就会被清理干净。那些活的足够久的对象，会变老生代，并且很少接受检查。
* 增量回收——如果有很多对象，并且我们试图一次遍历并标记整个对象集，那么可能会花费一些时间，并在执行中会有一定的延迟。因此，引擎试图将垃圾回收分解为多个部分。然后，各个部分分别执行。这需要额外的标记来跟踪变化，这样有很多微小的延迟，而不是很大的延迟。
* 空闲时间收集——垃圾回收器只在CPU空闲时运行，以减少对执行的可能影响。

