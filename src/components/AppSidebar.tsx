/********************************************************************* 
Author: Sukanta Manna  
Purpose: Create Sidebar of the application.
**********************************************************************/
import {
    Activity,
    Flame,
    WavesHorizontal,
    Tornado,
    ThermometerSun,
    WavesArrowUp,
    MountainSnow,
    ChevronDown,
    Baby,
    Biohazard,
    HeartPulse,
    ShieldAlert,
    Ribbon,
    Stethoscope
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator
} from "./ui/sidebar";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible";
import { ui } from "../i18n/ui";

import Logo from './Logo';

interface AppSidebarProps {
    currentLang: keyof typeof ui;
    currentPath: string;
}

function AppSidebar({ currentLang, currentPath }: AppSidebarProps) {
    const t = (key: keyof typeof ui['en']) => ui[currentLang][key] || ui['en'][key];
    const localizeUrl = (url: string) => currentLang === 'en' ? url : `/${currentLang}${url}`;

    const naturalDisasters = [
        { title: t("sidebar.categories.earthquakes"), url: localizeUrl("/earthquakes"), icon: Activity },
        { title: t("sidebar.categories.volcaniceruptions"), url: localizeUrl("/volcaniceruptions"), icon: Flame },
        { title: t("sidebar.categories.storms"), url: localizeUrl("/storms"), icon: Tornado },
        { title: t("sidebar.categories.tsunamis"), url: localizeUrl("/tsunamis"), icon: WavesArrowUp },
        { title: t("sidebar.categories.floods"), url: localizeUrl("/floods"), icon: WavesHorizontal },
        { title: t("sidebar.categories.droughts"), url: localizeUrl("/droughts"), icon: ThermometerSun },
        { title: t("sidebar.categories.wildfires"), url: localizeUrl("/wildfires"), icon: Flame },
        { title: t("sidebar.categories.avalanches"), url: localizeUrl("/avalanches"), icon: MountainSnow },
    ];

    const healthItems = [
        { title: t("sidebar.categories.childmortality"), url: localizeUrl("/childmortality"), icon: Baby },
        { title: t("sidebar.categories.hepatitis"), url: localizeUrl("/hepatitis"), icon: ShieldAlert },
        { title: t("sidebar.categories.hiv"), url: localizeUrl("/hiv"), icon: Ribbon },
        { title: t("sidebar.categories.lifeExpectancy"), url: localizeUrl("/lifeexpectancy"), icon: HeartPulse },
        { title: t("sidebar.categories.mumps"), url: localizeUrl("/mumps"), icon: Biohazard },
        { title: t("sidebar.categories.tuberculosis"), url: localizeUrl("/tuberculosis"), icon: Stethoscope },
    ];

    return (
        <Sidebar collapsible="icon" className="relative z-99999 border-r border-slate-200 dark:border-slate-800">
            <SidebarHeader className="h-14 px-0.5 flex items-center shrink-0 justify-start">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <a href={localizeUrl("/")} className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100">
                            <Logo showText={true} />
                        </a>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />

            {/* CONTENT - Added overflow-visible when collapsed */}
            <SidebarContent className="group-data-[state=collapsed]:overflow-visible">
                <div className="flex-1 overflow-y-auto group-data-[state=collapsed]:overflow-visible h-full pr-1 group-data-[state=collapsed]:pr-0 scrollbar-thin">

                    {/* 1. NATURAL DISASTERS */}
                    <SidebarGroup className="group-data-[state=collapsed]:overflow-visible">
                        <SidebarGroupLabel className="group-data-[state=collapsed]:hidden">
                            {t("sidebar.naturalDisasters")}
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="group-data-[state=collapsed]:overflow-visible">
                            <SidebarMenu className="group-data-[state=collapsed]:overflow-visible">
                                {/* COLLAPSED FLYOUT */}
                                <div className="hidden group-data-[state=collapsed]:block relative group/flyout w-full mb-2">
                                    <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-md cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <Activity className="h-5 w-5" />
                                    </div>

                                    {/* Flyout Menu Container */}
                                    <div className="absolute left-8 top-0 pl-2 w-56 opacity-0 pointer-events-none group-hover/flyout:opacity-100 group-hover/flyout:pointer-events-auto transition-all duration-150 z-99999">
                                        <div className="bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 rounded-md p-1">
                                            <div className="px-2 py-1.5 text-xs font-semibold border-b border-slate-100 dark:border-slate-800 mb-1 text-slate-400">
                                                {t("sidebar.naturalDisasters")}
                                            </div>
                                            <div className="max-h-80 overflow-y-auto space-y-0.5">
                                                {naturalDisasters.map((item) => (
                                                    <a key={item.title} href={item.url} className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                                                        <item.icon className="h-4 w-4 shrink-0 text-slate-400" />
                                                        <span className="inline-block">{item.title}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* EXPANDED LIST */}
                                <div className="group-data-[state=collapsed]:hidden space-y-1">
                                    {naturalDisasters.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <a href={item.url}>
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </div>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* 2. HEALTH METRICS */}
                    <SidebarGroup className="group-data-[state=collapsed]:overflow-visible">
                        <SidebarGroupContent className="group-data-[state=collapsed]:overflow-visible">
                            <SidebarMenu className="group-data-[state=collapsed]:overflow-visible">
                                {/* COLLAPSED FLYOUT */}
                                <div className="hidden group-data-[state=collapsed]:block relative group/flyout w-full">
                                    <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-md cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <HeartPulse className="h-5 w-5" />
                                    </div>

                                    {/* Flyout Menu Container */}
                                    <div className="absolute left-8 top-0 pl-2 w-56 opacity-0 pointer-events-none group-hover/flyout:opacity-100 group-hover/flyout:pointer-events-auto transition-all duration-150 z-99999">
                                        <div className="bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 rounded-md p-1">
                                            <div className="px-2 py-1.5 text-xs font-semibold border-b border-slate-100 dark:border-slate-800 mb-1 text-slate-400">
                                                {t("sidebar.healthMetrics")}
                                            </div>
                                            <div className="max-h-80 overflow-y-auto space-y-0.5">
                                                {healthItems.map((item) => (
                                                    <a key={item.title} href={item.url} className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200">
                                                        <item.icon className="h-4 w-4 shrink-0 text-slate-400" />
                                                        <span className="inline-block">{item.title}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* EXPANDED COLLAPSIBLE LIST */}
                                <div className="group-data-[state=collapsed]:hidden w-full">
                                    <Collapsible defaultOpen className="group/collapsible w-full">
                                        <SidebarGroupLabel asChild className="p-0 hover:bg-transparent h-auto">
                                            <CollapsibleTrigger className="w-full flex items-center justify-between text-xs font-medium text-slate-500 py-1.5 px-2">
                                                <span>{t("sidebar.healthMetrics")}</span>
                                                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                            </CollapsibleTrigger>
                                        </SidebarGroupLabel>
                                        <CollapsibleContent className="mt-1 space-y-1">
                                            <SidebarMenu>
                                                {healthItems.map((item) => (
                                                    <SidebarMenuItem key={item.title}>
                                                        <SidebarMenuButton asChild>
                                                            <a href={item.url}>
                                                                <item.icon className="h-4 w-4" />
                                                                <span>{item.title}</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                ))}
                                            </SidebarMenu>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                </div>
            </SidebarContent>
        </Sidebar>
    );
}

export default AppSidebar;