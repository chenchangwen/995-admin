<template>
    <el-upload
        ref="upload"
        accept="image/png,image/jpeg"
        action=""
        class="upload-file"
        :data-index="fileIndex"
        :limit="limit"
        :list-type="listType"
        :http-request="currentHttpRequest"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :name="name"
        :file-list="fileList">
        <el-button size="small" type="primary" v-if="!showTip" :class="{'from-edit' : isFormEdit}">点击上传</el-button>
        <i class="el-icon-upload" v-if="showTip"></i>
        <div slot="tip" class="el-upload__tip" v-if="showTip">{{TipText}}</div>
    </el-upload>
</template>
<script>
    export default {
        props: {
            name: {
                type: String,
                default: ''
            },
            listType: {
                type: String,
                default: 'picture-card'
            },
            limit: {
                type: Number,
                default: 999
            },
            fileList: {
                type: [Array],
                default: function () {
                    return []
                }
            },
            showTip: {
                type: Boolean,
                default: true
            },
            TipText:{
                type: String,
                default: '只能上传jpg/png文件，且不超过5M'
            },
            fileIndex: {
                type: Number,
                default: 0
            },
            httpRequest: {
                type: Function,
                default: function () {
                    return {}
                }
            },
            isFormEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                uploadUrl: '',
                uploadData: {},
                uploadFileName: '',
            }
        },
        methods: {
            handleChange(file, fileList) {
                if (fileList.length > 1) {
                    fileList.splice(0, 1);
                }
            },
            handleSuccess(response, file, fileList) {

            },
            handleExceed(files, fileList) {
                this.showErrorMessage(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            showErrorMessage(message) {
                this.$message.error(message || '只能上传jpg/png文件，且不超过5M!');
                this.$refs.upload.clearFiles();
                this.$emit('change');
            },
            currentHttpRequest(options) {
                let that = this;
                this.httpRequest(
                    options,
                    function (data) {
                        that.$message.success('上传文件成功');
                        that.$emit('change', data);
                    },
                    function (error) {
                        that.$message.error('上传文件失败,' + error.message );
                        that.$refs.upload.clearFiles();
                    }
                )
            }
        },
        mounted() {

        }
    }
</script>
<style lang="scss" scoped>

</style>

