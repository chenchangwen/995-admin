<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-plus" @click="handleAddRoot">添加一级菜单
            </el-button>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-edit" @click="handleSave">保存菜单
            </el-button>
        </div>
        <sl-vue-tree v-model="nodes" ref="tree">
            <template slot="title" slot-scope="{node}">
              <span class="item-icon">
                <i class="fa fa-file" v-if="node.isLeaf"></i>
              </span>
                {{node.title}}
            </template>
            <template slot="sidebar" slot-scope="{node}">
                <i class="el-icon-edit"></i>
                <i class="el-icon-circle-plus-outline" @click="handleClick(node)"></i>
                <i class="el-icon-remove-outline" @click="handleRemove(node)"></i>
            </template>
        </sl-vue-tree>

        <el-dialog :title="dialogText" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="form" :model="form"
                     label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
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
    import SlVueTree from 'sl-vue-tree';

    export default {
        components: {
            SlVueTree
        },
        data() {
            return {
                dialogButtonLoading: false,
                dialogButtonDisabled: false,
                dialogText: '新增',
                dialogFormVisible: false,
                dialogStatus: '',
                form: {
                    title: ''
                },
                rules: {
                    title: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                },
                nodes: [
                    {
                        "title": "Item1",
                    }]
            }
        },

        methods: {
            handleClick(node) {
                this.$refs.tree.updateNode(
                    node.path,
                    {children: [...this.$refs.tree.getNode(node.path).children, {title: '新菜单'}]}
                )
            },
            handleRemove(node) {
                let that = this;
                let $tree = this.$refs.tree;
                this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const paths = that.$tree.getSelected().map(node => node.path);
                    that.$tree.remove(paths);
                })
            },
            handleSave() {

            },
            handleAddRoot() {
                this.dialogFormVisible = true;
            },
            handleTempSave() {
                //this.nodes.push({title: '新菜单'});
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        alert(123)
                    }
                })
            }
        },
        mounted() {
            this.$tree = this.$refs.tree;
        }
    }
</script>glo

