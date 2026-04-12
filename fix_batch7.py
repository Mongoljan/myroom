#!/usr/bin/env python3
import os

BASE = '/Users/mongoljansabyrjan/myroom/src'

def fix_file(rel_path, replacements):
    path = os.path.join(BASE, rel_path)
    with open(path, encoding='utf-8') as f:
        content = f.read()
    before = content.count('dark:')
    for old, new in replacements:
        content = content.replace(old, new)
    after = content.count('dark:')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'{os.path.basename(path)}: +{after - before} dark:, total={after}')

# ── EnhancedHotelDetail.tsx (remaining icon colors) ───────────────────────────
fix_file('components/hotels/EnhancedHotelDetail.tsx', [
    ('<Cigarette className="w-4 h-4 text-gray-600 line-through"', '<Cigarette className="w-4 h-4 text-gray-600 dark:text-gray-400 line-through"'),
    ('<Briefcase className="w-4 h-4 text-gray-700"', '<Briefcase className="w-4 h-4 text-gray-700 dark:text-gray-300"'),
    ('<Building className="w-4 h-4 text-gray-700"', '<Building className="w-4 h-4 text-gray-700 dark:text-gray-300"'),
    ('<Car className="w-4 h-4 text-gray-700"', '<Car className="w-4 h-4 text-gray-700 dark:text-gray-300"'),
    ('<Package className="w-4 h-4 text-gray-600"', '<Package className="w-4 h-4 text-gray-600 dark:text-gray-400"'),
    ('<ElevatorIcon className="w-4 h-4 text-gray-700"', '<ElevatorIcon className="w-4 h-4 text-gray-700 dark:text-gray-300"'),
    ('<Cigarette className="w-4 h-4 text-gray-500"', '<Cigarette className="w-4 h-4 text-gray-500 dark:text-gray-400"'),
    ('<Baby className="w-4 h-4 text-gray-600 line-through"', '<Baby className="w-4 h-4 text-gray-600 dark:text-gray-400 line-through"'),
    ('<Car className="w-4 h-4 text-gray-700"', '<Car className="w-4 h-4 text-gray-700 dark:text-gray-300"'),  # repeat for second
    ('<Building className="w-4 h-4 text-gray-600"', '<Building className="w-4 h-4 text-gray-600 dark:text-gray-400"'),
    ('<Star className="w-4 h-4 text-gray-600"', '<Star className="w-4 h-4 text-gray-600 dark:text-gray-400"'),
    ('<Cigarette className="w-5 h-5 text-gray-600"', '<Cigarette className="w-5 h-5 text-gray-600 dark:text-gray-400"'),
    ('<Briefcase className="w-5 h-5 text-gray-700"', '<Briefcase className="w-5 h-5 text-gray-700 dark:text-gray-300"'),
    ('<Building className="w-5 h-5 text-gray-700"', '<Building className="w-5 h-5 text-gray-700 dark:text-gray-300"'),
    ('<Car className="w-5 h-5 text-gray-700"', '<Car className="w-5 h-5 text-gray-700 dark:text-gray-300"'),
    ('<Package className="w-5 h-5 text-gray-600"', '<Package className="w-5 h-5 text-gray-600 dark:text-gray-400"'),
    ('<ElevatorIcon className="w-5 h-5 text-gray-700"', '<ElevatorIcon className="w-5 h-5 text-gray-700 dark:text-gray-300"'),
    ('<Cigarette className="w-5 h-5 text-gray-500"', '<Cigarette className="w-5 h-5 text-gray-500 dark:text-gray-400"'),
    ('<Baby className="w-5 h-5 text-gray-600"', '<Baby className="w-5 h-5 text-gray-600 dark:text-gray-400"'),
    ('<Building className="w-5 h-5 text-gray-600"', '<Building className="w-5 h-5 text-gray-600 dark:text-gray-400"'),
])

# ── GoogleMapModal.tsx (remaining ternary patterns) ───────────────────────────
fix_file('components/common/GoogleMapModal.tsx', [
    (
        ": 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'",
        ": 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'"
    ),
    (
        ": 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'",
        ": 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'"
    ),
])

# ── app/search/page.tsx ───────────────────────────────────────────────────────
fix_file('app/search/page.tsx', [
    (
        'className="pt-24 pb-8 bg-gray-50">',
        'className="pt-24 pb-8 bg-gray-50 dark:bg-gray-900">'
    ),
    (
        'className="bg-white rounded-xl border border-gray-200 p-6">',
        'className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">'
    ),
    (
        'className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"',
        'className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse"'
    ),
    (
        'className="bg-white rounded-xl border border-gray-200 overflow-hidden">',
        'className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">'
    ),
])

# ── DatePicker.tsx (form inputs) ──────────────────────────────────────────────
fix_file('components/DatePicker.tsx', [
    (
        'className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-500"',
        'className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white dark:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"'
    ),
])

# ── CurrencyMegaMenu.tsx ──────────────────────────────────────────────────────
fix_file('components/header/CurrencyMegaMenu.tsx', [
    (
        'className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]"',
        'className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[150px]"'
    ),
    (
        'className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"',
        'className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"'
    ),
    (
        '<span className="text-gray-900">{currency.code}</span>',
        '<span className="text-gray-900 dark:text-gray-100">{currency.code}</span>'
    ),
    (
        '<span className="text-gray-600">{currency.symbol}</span>',
        '<span className="text-gray-600 dark:text-gray-400">{currency.symbol}</span>'
    ),
])

# ── LanguageMegaMenu.tsx ──────────────────────────────────────────────────────
fix_file('components/header/LanguageMegaMenu.tsx', [
    (
        'className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]"',
        'className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[150px]"'
    ),
    (
        'className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"',
        'className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"'
    ),
    (
        '<span className="text-gray-900">{language.name}</span>',
        '<span className="text-gray-900 dark:text-gray-100">{language.name}</span>'
    ),
])

# ── common/Toast.tsx ──────────────────────────────────────────────────────────
fix_file('components/common/Toast.tsx', [
    (
        '<p className="text-sm font-medium text-gray-900">{title}</p>',
        '<p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>'
    ),
    (
        '<p className="mt-1 text-sm text-gray-900">{message}</p>',
        '<p className="mt-1 text-sm text-gray-900 dark:text-white">{message}</p>'
    ),
    (
        'className="inline-flex text-gray-900 hover:text-gray-900 focus:outline-none"',
        'className="inline-flex text-gray-900 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none"'
    ),
])

# ── Toast.tsx (root src/components) ──────────────────────────────────────────
fix_file('Toast.tsx', [
    (
        'className="text-gray-400 hover:text-gray-600 transition"',
        'className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"'
    ),
])

# ── common/GoogleMapDisplay.tsx ───────────────────────────────────────────────
fix_file('components/common/GoogleMapDisplay.tsx', [
    (
        'className="text-gray-600 text-xs mt-2">',
        'className="text-gray-600 dark:text-gray-400 text-xs mt-2">'
    ),
    (
        'className={`w-full bg-gray-100 rounded-lg flex items-center justify-center ${containerClassName}`}',
        'className={`w-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center ${containerClassName}`}'
    ),
    (
        '<p className="text-gray-600">Loading map...</p>',
        '<p className="text-gray-600 dark:text-gray-400">Loading map...</p>'
    ),
    (
        'className="mt-2 text-sm text-gray-600"',
        'className="mt-2 text-sm text-gray-600 dark:text-gray-400"'
    ),
])

# ── login/otp/page.tsx ────────────────────────────────────────────────────────
fix_file('app/login/otp/page.tsx', [
    (
        'className="block text-sm font-medium text-gray-700 mb-2">',
        'className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">'
    ),
    (
        'className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-500"',
        'className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"'
    ),
])

# ── login/page.tsx ────────────────────────────────────────────────────────────
fix_file('app/login/page.tsx', [
    (
        'className="text-center text-sm text-gray-600">',
        'className="text-center text-sm text-gray-600 dark:text-gray-400">'
    ),
])

# ── signup/page.tsx ───────────────────────────────────────────────────────────
fix_file('app/signup/page.tsx', [
    (
        '({t(\'AuthSignup.optional\', \'Optional\')})</span>',
        '({t(\'AuthSignup.optional\', \'Optional\')})</span>'  # no change needed, text-gray-500 in parent
    ),
    (
        'className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"',
        'className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"'
    ),
])

# ── profile/page.tsx ──────────────────────────────────────────────────────────
fix_file('app/profile/page.tsx', [
    (
        'className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white"',
        'className="w-full px-3.5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white dark:bg-gray-700"'
    ),
])

# ── profile/password/page.tsx ─────────────────────────────────────────────────
fix_file('app/profile/password/page.tsx', [
    (
        'className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"',
        'className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"'
    ),
])

# ── profile/settings/page.tsx ─────────────────────────────────────────────────
fix_file('app/profile/settings/page.tsx', [
    (
        '`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${',
        '`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-gray-200 shadow transition-transform ${'
    ),
])

# ── sections/Partnerships.tsx ─────────────────────────────────────────────────
fix_file('components/sections/Partnerships.tsx', [
    (
        'className="inline-flex items-center px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg"',
        'className="inline-flex items-center px-6 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"'
    ),
    (
        '`${TYPOGRAPHY.body.standard} text-gray-700 font-medium`',
        '`${TYPOGRAPHY.body.standard} text-gray-700 dark:text-gray-300 font-medium`'
    ),
])

# ── sections/PopularDestinations.tsx ─────────────────────────────────────────
fix_file('components/sections/PopularDestinations.tsx', [
    (
        'className="text-gray-500 text-xs">Loading...</span>',
        'className="text-gray-500 dark:text-gray-400 text-xs">Loading...</span>'
    ),
    (
        'className="text-gray-600 text-[10px]"',
        'className="text-gray-600 dark:text-gray-400 text-[10px]"'
    ),
])

# ── sections/FaqSection.tsx ───────────────────────────────────────────────────
fix_file('components/sections/FaqSection.tsx', [
    (
        '`${TYPOGRAPHY.card.subtitle} text-gray-900 pr-3`',
        '`${TYPOGRAPHY.card.subtitle} text-gray-900 dark:text-white pr-3`'
    ),
    (
        'className="flex-shrink-0 text-gray-400 hover:text-gray-600"',
        'className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"'
    ),
])

# ── search/SearchFormContainer.tsx ────────────────────────────────────────────
fix_file('components/search/SearchFormContainer.tsx', [
    (
        '<div className="bg-white">',
        '<div className="bg-white dark:bg-gray-800">'
    ),
    (
        'className="bg-white border border-primary rounded-xl hover:border-gray-300 transition-all duration-200 overflow-hidden"',
        'className="bg-white dark:bg-gray-800 border border-primary rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 overflow-hidden"'
    ),
])

# ── common/WishlistButton.tsx ─────────────────────────────────────────────────
fix_file('components/common/WishlistButton.tsx', [
    (
        ": 'bg-white/80 text-gray-800 hover:bg-white hover:text-red-500'",
        ": 'bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 hover:text-red-500'"
    ),
])

# ── ui/magic-spinner.tsx ──────────────────────────────────────────────────────
fix_file('components/ui/magic-spinner.tsx', [
    (
        'className="absolute inset-0 rounded-full border-4 border-gray-200"',
        'className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"'
    ),
    (
        'className="text-gray-600">{t(\'common.searching\')}',
        'className="text-gray-600 dark:text-gray-400">{t(\'common.searching\')'
    ),
    (
        'className="text-gray-600"\n',
        'className="text-gray-600 dark:text-gray-400"\n'
    ),
])

# ── ui/dialog.tsx ─────────────────────────────────────────────────────────────
fix_file('components/ui/dialog.tsx', [
    (
        'border border-gray-200 bg-white p-6 shadow-lg duration-200',
        'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg duration-200'
    ),
    (
        '`text-sm text-gray-500 ${className}`',
        '`text-sm text-gray-500 dark:text-gray-400 ${className}`'
    ),
])

# ── ui/aceternity-loader.tsx ──────────────────────────────────────────────────
fix_file('components/ui/aceternity-loader.tsx', [
    (
        'className="w-8 h-8 border-2 border-gray-300 border-t-slate-900 rounded-full"',
        'className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-slate-900 dark:border-t-white rounded-full"'
    ),
    (
        'className="w-6 h-6 border-2 border-gray-200 border-t-slate-800 rounded-full"',
        'className="w-6 h-6 border-2 border-gray-200 dark:border-gray-600 border-t-slate-800 dark:border-t-white rounded-full"'
    ),
    (
        'className="text-sm text-gray-600"',
        'className="text-sm text-gray-600 dark:text-gray-400"'
    ),
])

# ── common/LoadingSkeleton.tsx ────────────────────────────────────────────────
fix_file('components/common/LoadingSkeleton.tsx', [
    (
        'className="bg-white rounded-xl shadow-md overflow-hidden"',
        'className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"'
    ),
])

# ── SearchResultsHeader.tsx remaining ────────────────────────────────────────
# remaining patterns are in commented-out code, skip

print('\nDone!')
