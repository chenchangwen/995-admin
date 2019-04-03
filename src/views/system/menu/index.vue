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
                {{node.title}}
            </template>
            <template slot="sidebar" slot-scope="{node}">
                <i class="el-icon-edit" @click="handleIconEdit(node, commonItem)"></i>
                <i class="el-icon-circle-plus-outline" @click="handleIconAdd(node,commonItem)"></i>
                <i class="el-icon-remove-outline" @click="handleIconRemove(node)"></i>
            </template>
        </sl-vue-tree>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @open="handleOpen">
            <el-form :rules="rules" ref="commonForm" :model="commonItem.form"
                     label-position="left"
                     label-width="80px"
                     style='margin-left:50px;'>
                <el-form-item :label="'名称'" prop="title">
                    <el-input v-model="form.title" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item :label="'前端链接'" prop="link">
                    <el-input v-model="form.link" placeholder="前端链接"></el-input>
                </el-form-item>
                <el-form-item :label="'拥有资源'" prop="resource" v-if="isShowResource">
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
    import selectResourceOne from '@/components/selectResourceOne';

    let validateResources = (rule, value, callback) => {
        let resource = pageVue.dialogStatus === 'create' ? pageVue.form.resource : pageVue.form.resource;
        if (resource.length === 0) {
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
                isShowResource: false,
                selectedNode: '',
                nodeFilterField: ['children', 'floor', 'id', 'index', 'link', 'parentId', 'resource', 'title'],
                commonItem: {
                    form: {
                        title: '',
                        link: '',
                        resource: {},
                    },
                    key: '',
                    formName: 'commonForm'
                },
                rules: {
                    title: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    link: [{required: true, message: '前端链接不能为空', trigger: 'blur'}],
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
                },
                handleIconAdd(node) {
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
                        })
                        this.dialogButtonLoading = false;
                        this.dialogButtonDisabled = false;
                    });
                },
                handleTempSave() {
                    let that = this;
                    this.$refs['commonForm'].validate((valid) => {
                        if (valid) {
                            let node = _.cloneDeep(that.form);
                            let selectedNode = that.selectedNode;
                            let $tree = that.$refs.tree;
                            node.data = {
                                link: node.link,
                                resource: node.resource
                            };
                            if (that.dialogStatus === 'create') {
                                //一级节点
                                if (!selectedNode) {
                                    that.nodes.push(node);
                                }
                                //其他节点
                                else {
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
                    this.commonItem.form.resource = [];
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
                            if (itemNode['children']) {
                                that.clearNodes(itemNode['children']);
                            }
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
                        that.clearNodes(data);
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

