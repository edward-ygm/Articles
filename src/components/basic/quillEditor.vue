<template>
<!-- 富媒体编辑器 -->
  <div class="quillEditor adi-quill-edit">
  <quill-editor 
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
      @change="onEditorChange($event)">
  </quill-editor>
    <button v-on:click="saveHtml">保存</button>
  </div>

</template>

<script>
/**这个是富媒体编辑器的组件 */
export default {
   methods:{
        onEditorReady(editor) {// 准备编辑器
        },
        onEditorBlur(){// 失去焦点事件
        }, 
        onEditorFocus(){// 获得焦点事件
        }, 
        onEditorChange(){// 内容改变事件
        }, 
   }
}
</script>

<style>

</style>