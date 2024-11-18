'use client'
import { compileCode } from "@/actions/compile"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { codeSnippets, languageOptions } from "@/config/config"
import { Button } from "@headlessui/react"
import Editor from '@monaco-editor/react'
import { Loader, Play } from "lucide-react"
import { useTheme } from "next-themes"
import { useRef, useState } from "react"
import { ModeToggleBtn } from "./mode-toggle-btn"
import SelectLanguages, { selectedLanguageOptionProps } from "./ui/SelectLanguages"

export default function EditorComponent() {
  const {theme} = useTheme()
  const [sourceCode,setSourceCode]=useState(codeSnippets["javascript"])
  const [languageOption,setLanguageOption]=useState(languageOptions[0])
  const [loading,setLoading]=useState(false)
  const [output,setoutput]=useState("")
  // const language = languageOption.language

  // console.log(language);
  
  const editorRef = useRef(null)
  // console.log(sourceCode)

  function handleEditorDidMount(editor:any){
    editorRef.current = editor;
    editor.focus();
  }
  function handleOnchange(value:string|undefined){
    if(value){
      setSourceCode(value)
    }
  }
  function onSelect(value:selectedLanguageOptionProps){
    setLanguageOption(value)
    setSourceCode(codeSnippets[value.language]);
  }
  async function executeCode() {
    setLoading(false)
    const requestData = {
      "language": languageOption.language,
      "version": languageOption.version,
      "files": [
          {
          "content": sourceCode,
          }
      ],
    }
    try {
      const result = await compileCode(requestData);
      setoutput(result.run.output)
      console.log(result)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen dark:bg-sky-900 rounded-2xl shadow-2xl p-4">
      {/* EDITOR HEADER */}
      <div className="flex items-center justify-between pb-3">
      <h2 className="scroll-m-20  text-2xl font-semibold tracking-tight first:mt-0">
      Codex</h2>
        <div className="flex items-center space-x-2">
          <ModeToggleBtn/>
          <div className="w-[230px]">
            <SelectLanguages onSelect={onSelect} selectedLanguageOption={languageOption}/>
          </div>
          
        </div>
      </div>
      {/* EDITOR */}
      <div className="bg-slate-400 dark:bg-slate-950 p-3 rounded-2xl">
      <ResizablePanelGroup
      direction="horizontal"
      className="w-full rounded-lg border md:min-w-[450px] dark:bg-slate-900"
    >
      <ResizablePanel defaultSize={50} minSize={35}>
        <Editor theme={theme==="dark"?"vs-dark":"vs-light"} height="100vh" defaultLanguage={languageOption.language} defaultValue={codeSnippets['${language}']} onMount={handleEditorDidMount} value={sourceCode} onChange={handleOnchange} language={languageOption.language}/>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel defaultSize={50} minSize={35}>
        {/* Header */}
        <div className="space-y-3 bg-slate-300 dark:bg-slate-900 min-h-screen">
          <div className="flex items-center justify-between bg-slate-400 dark:bg-slate-950 px-4 py-2">
            <h2>output</h2>
            {loading?(
              <Button disabled className="dark:bg-purple-600  dark:hover:bg-purple-700 bg-slate-800 hover:bg-slate-900 text-slate-100 flex space-x-2" size={'sm'}>
              <Loader className="w-4 h-4 animate-spin"/>
              <span>Running please wait</span>
              </Button>
            ):(
              <Button onClick={executeCode} className="dark:bg-purple-600  dark:hover:bg-purple-700 bg-slate-800 hover:bg-slate-900 text-slate-100 flex space-x-2" size={'sm'}>
              <Play className="w-4 h-4"/>
              <span>Run</span>
            </Button>
            )}
          </div>
          <div className="px-6">
            <h2>{output}</h2>
          </div>
        </div>
        {/* body */}
      </ResizablePanel>
    </ResizablePanelGroup>
      </div>
    </div>
  )
}
