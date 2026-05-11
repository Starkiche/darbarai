<template>
  <div>
    <!-- Barre d'outils -->
    <div
      v-if="editor"
      class="flex flex-wrap gap-1 p-2 bg-stone-50 border border-stone-200 rounded-t-lg border-b-0"
    >
      <button
        type="button"
        class="toolbar-btn font-bold"
        :class="{ active: editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        B
      </button>
      <button
        type="button"
        class="toolbar-btn italic"
        :class="{ active: editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        I
      </button>
      <button
        type="button"
        class="toolbar-btn underline"
        :class="{ active: editor.isActive('underline') }"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        U
      </button>
      <div class="w-px bg-stone-300 mx-1" />
      <button
        type="button"
        class="toolbar-btn text-xs"
        :class="{ active: editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
      <button
        type="button"
        class="toolbar-btn text-xs"
        :class="{ active: editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </button>
      <div class="w-px bg-stone-300 mx-1" />
      <button
        type="button"
        class="toolbar-btn text-xs"
        :class="{ active: editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        • Liste
      </button>
      <button
        type="button"
        class="toolbar-btn text-xs"
        :class="{ active: editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        1. Liste
      </button>
      <div class="w-px bg-stone-300 mx-1" />
      <button
        type="button"
        class="toolbar-btn text-xs"
        @click="editor.chain().focus().setHorizontalRule().run()"
      >
        — Séparateur
      </button>
    </div>

    <!-- Zone d'édition -->
    <EditorContent
      :editor="editor"
      class="prose prose-stone max-w-none min-h-[200px] border border-stone-200 rounded-b-lg p-4 bg-white focus-within:ring-2 focus-within:ring-terracotta-500 focus-within:border-transparent"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

const props = defineProps<{ modelValue: string | null }>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const editor = useEditor({
  content: props.modelValue ?? "",
  extensions: [StarterKit, Underline],
  onUpdate({ editor }) {
    emit("update:modelValue", editor.getHTML());
  },
});

// Sync si la valeur change depuis l'extérieur (ex: changement de service en édition)
watch(
  () => props.modelValue,
  (newVal) => {
    if (editor.value && newVal !== editor.value.getHTML()) {
      editor.value.commands.setContent(newVal ?? "");
    }
  },
);

onBeforeUnmount(() => editor.value?.destroy());
</script>

<style scoped>
.toolbar-btn {
  @apply p-1.5 rounded hover:bg-stone-200 transition-colors text-sm text-stone-700;
}
.toolbar-btn.active {
  @apply bg-stone-200 text-stone-900;
}
</style>
