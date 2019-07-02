<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-plus" @click="handleAdd">添加一级菜单
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
                <el-form-item :label="'前端链接'" prop="link" v-if="!isRootLevel">
                    <el-input v-model="form.link" placeholder="前端链接"></el-input>
                </el-form-item>
                <el-form-item :label="'拥有资源'" prop="resource" v-if="!isRootLevel">
                    <select-resource-one :value.sync="form.resource" :key="commonItem.key"></select-resource-one>
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
    import selectResourceOne from '../../../components/select-resource-one';

    let validateResources = (rule, value, callback) => {
        if (!pageVue.isRootLevel && _.isEmpty(pageVue.form.resource)) {
            callback(new Error('请选择资源'));
        } else {
            callback();
        }
    };
    let pageVue = '';
    let page = new pageInit(
        {
            components: {
                slVueTree,
                selectResourceOne
            },
            data: {
                isRootLevel: false,
                selectedNode: '',
                nodeFilterField: ['children', 'floor', 'id', 'index', 'link', 'parentId', 'resource', 'title'],
                commonItem: {
                    form: {
                        title: '',
                        name: '',
                        link: '',
                        resource: '',
                    },
                    key: '',
                    formName: 'commonItem'
                },
                rules: {
                    title: [{required: true, message: '名称不能为空', trigger: 'blur'}],

                    resource: [
                        {validator: validateResources, trigger: 'blur'}
                    ],
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
                    this.isRootLevel = _.isEmpty(item.resource);
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
                    let options = {
                        url: '/menus/edit',
                        method: 'post',
                        data: items
                    };
                    this.dialogButtonLoading = true;
                    this.dialogButtonDisabled = true;

                    request(options).then(() => {
                        this.$notify({
                            title: '成功',
                            message: '更新成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.dialogButtonLoading = false;
                        this.dialogButtonDisabled = false;
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
                            if (node.link) {
                                node.data.link = node.link;
                            }
                            if (node.resource) {
                                node.data.resource = node.resource;
                            }
                            if (that.dialogStatus === 'create') {
                                //一级节点
                                if (!selectedNode) {
                                    that.nodes.push(node);
                                }
                                //其他节点
                                else {
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
                    if (this.dialogStatus === 'create') {
                        this.commonItem.form.link = '';
                        this.commonItem.form.resource = {};
                    }
                    this.commonItem.key += 1;
                },
                formReset(node) {
                    this.setItem(this.commonItem);
                    this.resetForm();
                    this.selectedNode = node;
                },
                clearNodes(node) {
                    //fixed by daji 2019070 华而不实的代码，还有bug，修复添加保存resource丢失问题
                    let that = this;
                    node.map(function (itemNode) {


                        //先拷贝，镜像数据
                        for (let item in itemNode.data) {
                            itemNode[item] = itemNode.data[item];
                        }

                        //清除不需要提交数据
                        for (let item in itemNode) {
                            if (that.nodeFilterField.indexOf(item) === -1) {
                                delete itemNode[item];
                            }
                        }

                        //递归！
                        if (!_.isEmpty(itemNode.children)) {
                            that.clearNodes(itemNode['children']);
                        }
                        itemNode.name = itemNode.title;
                        delete itemNode.title

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
                        if (_.isEmpty(itemNode['resource'])) {
                            delete itemNode.link;
                            delete itemNode.link;
                        } else {
                            itemNode.isLeaf = true;
                            itemNode.data = {
                                link: itemNode.link,
                                resource: itemNode.resource
                            }
                        }
                        if (!_.isEmpty(itemNode['children'])) {
                            that.clearNodesOnLoad(itemNode.children);
                        } else {
                            delete itemNode.children;
                        }
                    })
                },
                queryMenus() {
                    let options = {
                        url: '/menus',
                        method: 'get',
                    };
                    let that = this;
                    request(options).then((response) => {
                        let data = response.data;
                        that.clearNodesOnLoad(data);
                        that.nodes = data;
                    });
                }
            },
            created() {
                pageVue = this;
                this.queryMenus();
            }
        }
    );
    export default page;
</script>

