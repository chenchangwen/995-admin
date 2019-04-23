<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-plus" @click="handleAdd">添加一级分类
            </el-button>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" @click="handleSave"
                       :loading="dialogButtonLoading"
                       :disabled="dialogButtonDisabled">保存菜单
            </el-button>
        </div>
        <sl-vue-tree v-model="nodes" ref="tree" v-if="nodes.length > 0">
            <template slot="title" slot-scope="{node}">
                <i class="el-icon-document" v-if="node.isLeaf"></i> {{node.title}}
            </template>
            <template slot="sidebar" slot-scope="{node}">
                <i class="el-icon-edit" @click="handleIconEdit(node, commonItem)"></i>
                <i class="el-icon-circle-plus-outline" @click="handleIconAdd(node,commonItem)" v-if="!node.isLeaf"></i>
                <i class="el-icon-remove-outline" @click="handleIconRemove(node)"></i>
            </template>
        </sl-vue-tree>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @open="handleOpen">
            <el-form :rules="rules" ref="commonItem" :model="commonItem.form"
                     label-position="left"
                     label-width="80px"
                     style='margin-left:50px;'>
                <el-form-item :label="'名称'" prop="title">
                    <el-input v-model="form.title" placeholder="名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="handleTempSave">确认</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import slVueTree from 'sl-vue-tree';
    import {mapGetters} from 'vuex';

    let pageVue = '';
    let page = new pageInit(
        {
            components: {
                slVueTree
            },
            data: {
                isNoMountedRequest: true,
                originData: '',
                isRootLevel: false,
                selectedNode: '',
                nodeFilterField: ['children', 'floor', 'id', 'index', 'parentId', 'title', 'classifySubjectId'],
                commonItem: {
                    form: {
                        title: '',
                        name: '',
                    },
                    key: '',
                    formName: 'commonItem'
                },
                rules: {
                    name: [{required: true, message: '名称不能为空', trigger: 'blur'}]
                },
                nodes: []
            },
            methods: {
                handleAdd() {
                    this.dialogStatus = 'create';
                    this.formReset();
                    this.isRootLevel = true;
                },
                handleIconAdd(node) {
                    this.isRootLevel = false;
                    this.dialogStatus = 'create';
                    this.formReset(node);
                },
                handleIconEdit(node) {
                    this.dialogStatus = 'update';
                    this.formReset(node);
                    let item = {
                        title: node.title
                    };
                    item = _.assign({}, item, node.data);
                    this.isRootLevel = item.floor === 0;
                    this.setDialogItem(item);
                },
                handleIconRemove(node) {
                    let $tree = this.$refs.tree;
                    this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const paths = $tree.getSelected().map(node => node.path);
                        $tree.remove(paths);
                    })
                },
                handleSave() {
                    let items = _.cloneDeep(this.nodes);
                    this.clearNodes(items);
                    // let data = _.assignIn(that.originData.classifies, items);
                    this.originData.classifies = items;

                    // debugger;
                    // return false;
                    let options = {
                        url: '/classifies/subjects/edit',
                        method: 'post',
                        data: this.originData
                    };

                    this.dialogButtonLoading = true;
                    this.dialogButtonDisabled = true;
                    let that = this;
                    request(options).then((response) => {
                        this.$notify({
                            title: '成功',
                            message: '更新成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.dialogButtonLoading = false;
                        this.dialogButtonDisabled = false;
                        that.originData = response.data;
                        delete that.originData.updateTime;
                        delete that.originData.createTime;
                        let classifies = that.originData.classifies;
                        that.clearNodesOnLoad(classifies);
                        that.nodes = classifies;
                    });
                },
                handleTempSave() {
                    let that = this;
                    this.$refs['commonItem'].validate((valid) => {
                        if (valid) {
                            let node = _.cloneDeep(that.form);
                            let selectedNode = that.selectedNode;
                            let $tree = that.$refs.tree;
                            node.data = {};

                            if (that.dialogStatus === 'create') {
                                //一级节点
                                if (!selectedNode) {
                                    node.floor = 0;
                                    that.nodes.push(node);
                                }
                                //其他节点
                                else {
                                    node.floor = 1;
                                    node.isLeaf = true;
                                    $tree.updateNode(
                                        selectedNode.path,
                                        {children: [...$tree.getNode(selectedNode.path).children, node]}
                                    )
                                }
                            }
                            if (that.dialogStatus === 'update') {
                                $tree.updateNode(
                                    selectedNode.path,
                                    node
                                );
                            }
                            this.dialogFormVisible = false;
                        }
                    })
                },
                handleOpen() {
                    this.commonItem.key += 1;
                },
                formReset(node) {
                    this.setItem(this.commonItem);
                    this.resetForm();
                    this.selectedNode = node;
                },
                clearNodes(node) {
                    let that = this;
                    node.map(function (itemNode) {
                        for (let item in itemNode) {
                            if (that.nodeFilterField.indexOf(item) === -1) {
                                delete itemNode[item];
                            }
                        }
                        delete itemNode['isLeaf'];
                        itemNode.name = itemNode.title;
                        delete itemNode['title'];
                        if (!_.isEmpty(itemNode.children)) {
                            that.clearNodes(itemNode['children']);
                        }
                    })
                },
                clearNodesOnLoad(node) {
                    let that = this;
                    node.map(function (itemNode) {
                        itemNode.title = itemNode.name;
                        for (let item in itemNode) {
                            if (that.nodeFilterField.indexOf(item) === -1) {
                                delete itemNode[item];
                            }
                        }
                        if (itemNode.floor === 1) {
                            itemNode.isLeaf = true;
                        }
                        if (!_.isEmpty(itemNode['children'])) {
                            that.clearNodesOnLoad(itemNode.children);
                        } else {
                            delete itemNode.children;
                        }
                    })
                },
                queryClassifies() {
                    let options = {
                        url: 'classifies/subjects',
                        method: 'get',
                        params: {
                            search: 'id==' + this.$route.params.id
                        }
                    };
                    let that = this;
                    request(options).then((response) => {
                        that.originData = response.data[0];
                        delete that.originData.updateTime;
                        delete that.originData.createTime;
                        let classifies = that.originData.classifies;
                        that.clearNodesOnLoad(classifies);
                        that.nodes = classifies;
                    });
                }
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
            created() {
                pageVue = this;
                this.queryClassifies();
            }
        }
    );
    export default page;
</script>

