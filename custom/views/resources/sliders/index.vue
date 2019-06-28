<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="queryItem.name.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(commonItem)" type="primary"
                       icon="el-icon-edit">新增
            </el-button>

        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit
                  highlight-current-row>

            <el-table-column  label='id' width="200">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>

            <el-table-column  label='图片' width="200">
                <template slot-scope="scope">
                    <img width="180px" class="card-img" :src="oss + scope.row.image" v-if="scope.row.image" preview/>

                </template>
            </el-table-column>


            <el-table-column  label='名称 & 链接'  >
                <template slot-scope="scope">
                    <p>名称:{{scope.row.name}} </p>
                    <p>链接:{{scope.row.url}}</p>
                </template>
            </el-table-column>


            <el-table-column  label='排序(大的靠前)' width="130" >
                <template slot-scope="scope">
                    {{scope.row.index}}
                </template>
            </el-table-column>

            <el-table-column  label='启用' width="100">
                <template slot-scope="scope">
                    <i :class="scope.row.enable ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>

            <el-table-column  label='过期时间'  >
                <template slot-scope="scope">
                    {{scope.row.expireTime}}
                </template>
            </el-table-column>



            <el-table-column align="center" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row,commonItem)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleConfirm(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="commonItem.rules" ref="commonItem" :model="commonItem.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>



                <el-form-item :label="'图片'" prop="image">
                    <el-upload
                        action=""
                         :before-upload="imageToBase64"
                        list-type="picture-card"
                        :show-file-list="false"
                        v-model="commonItem.form.image"
                         >
                        <img height="145px" v-if="commonItem.form.image" :src="commonItem.form.image" >
                        <i v-else class="el-icon-plus"></i>

                    </el-upload>


                </el-form-item>

                <el-form-item :label="'链接'" prop="url">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="链接"
                        v-model="commonItem.form.url">
                    </el-input>
                </el-form-item>

                <el-form-item :label="'排序'" prop="index">
                    <el-input
                        type="number"
                        placeholder="排序"
                        v-model="commonItem.form.index">
                    </el-input>
                </el-form-item>

                <el-form-item :label="'名称'" prop="name">
                    <el-input v-model="commonItem.form.name" placeholder="名称"></el-input>
                </el-form-item>

                <el-form-item :label="'启用'">
                    <el-switch
                        v-model="commonItem.form.enable"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>

                <el-form-item :label="'截止时间'" prop="expireTime">
                    <el-date-picker v-model="commonItem.form.expireTime" type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                                    placeholder="截止时间"
                                    >
                    </el-date-picker>
                </el-form-item>


            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveData(commonItem)"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import {mapGetters} from 'vuex';
    import * as uploadUtils from '../../../utils/upload'



    let page = new pageInit(
        {
            data: {

                oss : oss,

                cover: {
                    fileList: []
                },
                commonItem: {
                    form: {
                        name: '',
                        index: 0,
                        url: '',
                        enable: true,
                        userId: 0,
                        image: '',
                        expireTime: ''
                    },
                    rules: {
                        url: [{required: true, message: '链接不能为空', trigger: 'blur'}],
                        index: [{required: true, message: '排序不能为空', trigger: 'blur'}]
                    },
                    formName: 'commonItem'
                },
                // expireTime: {
                //
                //     disabledDate: (time) => {
                //         return time.getTime() > this.commonItem.form.expireTime
                //     }
                // },
                //查询对象
                queryItem: {
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/sliders',
                }
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
            methods: {
                imageToBase64(file) {
                    let that = this;
                    let fileReader = new FileReader()
                    if (file) {
                        fileReader.readAsDataURL(file)
                    }
                    fileReader.onload = () => {
                         uploadUtils.compress(fileReader.result).then(function (imageData) {
                             that.commonItem.form.image = imageData;
                         });
                    }
                },
                beforeOpenDialog(row) {
                    if (row) {
                        let options = {
                            url: '/sliders/' + row.id,
                            method: 'get'
                        }
                        let that = this;

                    }

                    if( this.dialogStatus === 'update'){
                        this.commonItem.form.image = oss + row.image;
                    }else  if( this.dialogStatus === 'create'){
                        this.commonItem.form.image  = ''
                    }


                },
                beforeEditRequest(row) {
                    if(this.dialogStatus === 'create' || this.dialogStatus === 'update') {
                        this.postForm = _.cloneDeep(this.commonItem.form);
                        this.postForm.index = parseInt(this.commonItem.form.index )
                        this.postForm.userId =this.home.user.id;
                     }
                },
            }
        }
    );
    export default page;
</script>


