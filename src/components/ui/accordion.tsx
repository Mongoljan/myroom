"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
))
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
  }
>(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300",
      className
    )}
    whileHover={{ 
      y: -2,
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
    }}
    layout
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean
  icon?: React.ReactNode
}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, isOpen, icon, ...props }, ref) => (
  <motion.button
    className={cn(
      "w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
      className
    )}
    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.02)" }}
    transition={{ duration: 0.2 }}
    ref={ref}
    {...props}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center flex-1 min-w-0">
        {icon && (
          <motion.div 
            className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl flex items-center justify-center mr-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {icon}
          </motion.div>
        )}
        
        <div className="text-lg font-semibold text-gray-900 dark:text-white pr-4 leading-tight">
          {children}
        </div>
      </div>
      
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </div>
  </motion.button>
))
AccordionTrigger.displayName = "AccordionTrigger"

interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, isOpen, ...props }, ref) => (
  <AnimatePresence initial={false}>
    {isOpen && (
      <motion.div
        ref={ref}
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: "auto", 
          opacity: 1,
          transition: {
            height: { duration: 0.3, ease: "easeInOut" },
            opacity: { duration: 0.2, delay: 0.1 }
          }
        }}
        exit={{ 
          height: 0, 
          opacity: 0,
          transition: {
            height: { duration: 0.3, ease: "easeInOut" },
            opacity: { duration: 0.1 }
          }
        }}
        className={cn("overflow-hidden", className)}
        {...props}
      >
        <motion.div 
          className="px-6 pb-6"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <div className="pl-14 border-l-2 border-blue-100 dark:border-blue-800/50">
            <motion.div 
              className="text-gray-600 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
))
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }