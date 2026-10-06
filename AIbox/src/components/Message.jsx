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
        <div className="flex items-start justify-end gap-2 my-4 w-full min-w-0">
          <div
            className="flex flex-col gap-2 p-2 px-4 min-w-0 max-w-[calc(100%-2.25rem)]
              md:max-w-xl bg-slate-50 dark:bg-[#0F1A14] border border-[#1F4D36]
              rounded-md break-words [overflow-wrap:anywhere]">
            <p className="text-sm text-black dark:text-green-100 break-words">
              {message.content}
            </p>
            <span className="text-xs text-gray-400 dark:text-green-300/70">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>

          <LuUser className="w-7 h-7 md:w-8 md:h-8 p-1 shrink-0 rounded-full
              bg-green-200 dark:bg-[#1F4D36] text-black dark:text-green-300"/>
        </div>
      ) : (
        <div className="flex items-start gap-2 my-4 w-full min-w-0">
          <LuBot className="
              w-7 h-7 md:w-8 md:h-8 p-1 shrink-0 rounded-full
              bg-green-200 dark:bg-[#1F4D36] text-black dark:text-green-300"/>
          <div className="flex flex-col gap-2 flex-1 min-w-0 max-w-full p-2 px-4
              bg-green-100/20 dark:bg-[#13231B] border border-[#1F4D36]
              rounded-md break-words [overflow-wrap:anywhere]">

            {/* IMAGE RESPONSE */}

            {message.isImage ? (
              <img src={message.content} alt="" className="w-full max-w-md mt-2 rounded-md object-contain"/>
            ) : (
              <div className="text-sm text-black dark:text-green-100 reset-tw
                  min-w-0 max-w-full break-words [overflow-wrap:anywhere]">

                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ children }) => (
                      <div className="w-full max-w-full overflow-x-auto my-4">
                        <table className="min-w-max border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th
                        className="
                          border border-[#1F4D36] px-3 py-2 text-left
                          bg-green-900/20 font-semibold whitespace-nowrap
                        "
                      >
                        {children}
                      </th>
                    ),

                    /* TABLE CELL */

                    td: ({ children }) => (
                      <td
                        className="
                          border border-[#1F4D36] px-3 py-2
                          align-top
                        "
                      >
                        {children}
                      </td>
                    ),

                    /* CODE BLOCK */

                    pre: ({ children }) => (
                      <pre
                        className="
                          max-w-full overflow-x-auto my-3 p-3 rounded-md
                          bg-[#111111] border border-[#1F4D36]
                        "
                      >
                        {children}
                      </pre>
                    ),

                    /* INLINE / BLOCK CODE */

                    code: ({ children, className }) => (
                      <code
                        className={`
                          ${className || ''}
                          break-words [overflow-wrap:anywhere]
                        `}
                      >
                        {children}
                      </code>
                    ),

                    /* LINKS */

                    a: ({ children, href }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:underline break-all"
                      >
                        {children}
                      </a>
                    ),

                    /* HEADINGS */

                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mt-4 mb-3">
                        {children}
                      </h1>
                    ),

                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold mt-4 mb-3">
                        {children}
                      </h2>
                    ),

                    h3: ({ children }) => (
                      <h3 className="text-lg font-bold mt-3 mb-2">
                        {children}
                      </h3>
                    ),

                    /* LISTS */

                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 my-3 space-y-1">
                        {children}
                      </ul>
                    ),

                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 my-3 space-y-1">
                        {children}
                      </ol>
                    ),

                    /* BLOCKQUOTE */

                    blockquote: ({ children }) => (
                      <blockquote
                        className="
                          border-l-4 border-green-500 pl-4 my-3
                          text-green-200 italic
                        "
                      >
                        {children}
                      </blockquote>
                    ),

                    /* HORIZONTAL RULE */

                    hr: () => (
                      <hr className="my-5 border-[#1F4D36]" />
                    ),

                  }}
                >
                  {message.content}
                </Markdown>

              </div>
            )}

            {/* TIMESTAMP */}

            <span className="text-xs text-gray-400 dark:text-green-300/70">
              {moment(message.timestamp).fromNow()}
            </span>

          </div>

        </div>
      )}

    </div>
  )
}

export default Message