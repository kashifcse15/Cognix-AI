import React, { useEffect } from 'react'
import { LuUser, LuBot } from 'react-icons/lu'
import moment from 'moment'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Prism from 'prismjs'

const Message = ({ message }) => {
  useEffect(() => {
    Prism.highlightAll()
  }, [message.content])

  return (
    <div className="w-full min-w-0">
      {message.role === 'user' ? (
        <div className="flex justify-end my-4 w-full min-w-0">
          <div className="flex flex-col gap-2 p-2 px-4 min-w-0 max-w-[92%] md:max-w-xl bg-slate-50 dark:bg-[#0F1A14] border border-[#1F4D36] rounded-md break-words [overflow-wrap:anywhere]">
            <div className="flex items-start gap-2 min-w-0">
              <LuUser className="w-6 h-6 md:w-7 md:h-7 p-1 shrink-0 rounded-full bg-green-200 dark:bg-[#1F4D36] text-black dark:text-green-300" />
              <p className="text-sm text-black dark:text-green-100 break-words min-w-0 [overflow-wrap:anywhere]">{message.content}</p>
            </div>
            <span className="text-xs text-gray-400 dark:text-green-300/70">{moment(message.timestamp).fromNow()}</span>
          </div>
        </div>
      ) : (
        <div className="my-4 w-full min-w-0">
          <div className="flex items-start gap-2 min-w-0">
            <LuBot className="w-6 h-6 md:w-7 md:h-7 p-1 shrink-0 rounded-full bg-green-200 dark:bg-[#1F4D36] text-black dark:text-green-300" />
            <div className="flex-1 min-w-0 max-w-full p-2 px-4 bg-green-100/20 dark:bg-[#13231B] border border-[#1F4D36] rounded-md break-words [overflow-wrap:anywhere]">
              {message.isImage ? (
                <img src={message.content} alt="" className="w-full max-w-md mt-2 rounded-md object-contain" />
              ) : (
                <div className="text-sm text-black dark:text-green-100 reset-tw min-w-0 max-w-full overflow-hidden">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({ children }) => (
                        <div className="w-full min-w-0 max-w-full overflow-x-auto my-4">
                          <table className="min-w-max border-collapse text-sm">{children}</table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="border border-[#1F4D36] px-3 py-2 text-left bg-green-900/20 font-semibold whitespace-nowrap">{children}</th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-[#1F4D36] px-3 py-2 align-top">{children}</td>
                      ),
                      pre: ({ children }) => (
                        <pre className="max-w-full overflow-x-auto my-3 p-3 rounded-md bg-[#111111] border border-[#1F4D36]">{children}</pre>
                      ),
                      code: ({ children, className }) => (
                        <code className={`${className || ''} break-words [overflow-wrap:anywhere]`}>{children}</code>
                      ),
                      a: ({ children, href }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline break-all">{children}</a>
                      ),
                      h1: ({ children }) => <h1 className="text-2xl font-bold mt-4 mb-3">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold mt-4 mb-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-bold mt-3 mb-2">{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc pl-5 my-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 my-3 space-y-1">{children}</ol>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-green-500 pl-4 my-3 text-green-200 italic">{children}</blockquote>
                      ),
                      hr: () => <hr className="my-5 border-[#1F4D36]" />
                    }}
                  >
                    {message.content}
                  </Markdown>
                </div>
              )}
              <span className="text-xs text-gray-400 dark:text-green-300/70 block mt-2">{moment(message.timestamp).fromNow()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Message