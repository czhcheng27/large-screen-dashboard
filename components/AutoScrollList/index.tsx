"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import css from "./index.module.scss";

interface AutoScrollListProps {
    /** 子元素 */
    children: React.ReactNode;
    /** 滚动速度 (像素/帧)，默认 1 */
    speed?: number;
    /** 是否暂停滚动，默认 false */
    paused?: boolean;
    /** 容器类名 */
    className?: string;
    /** 内容区域类名 */
    contentClassName?: string;
}

/**
 * 自动滚动列表组件
 * - 内容自动向上滚动
 * - 鼠标悬停时暂停
 * - 鼠标离开后继续滚动
 * - 无缝循环滚动
 */
const AutoScrollList: React.FC<AutoScrollListProps> = ({
    children,
    speed = 1,
    paused = false,
    className = "",
    contentClassName = "",
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const scrollPositionRef = useRef(0);
    const animationFrameRef = useRef<number | null>(null);

    // 滚动逻辑
    const scroll = useCallback(() => {
        if (!containerRef.current || !contentRef.current) return;

        const container = containerRef.current;
        const content = contentRef.current;
        const contentHeight = content.scrollHeight / 2; // 因为内容被复制了一份

        // 如果内容不够高，不需要滚动
        if (contentHeight <= container.clientHeight) {
            return;
        }

        scrollPositionRef.current += speed;

        // 当滚动超过一半内容时，重置位置实现无缝循环
        if (scrollPositionRef.current >= contentHeight) {
            scrollPositionRef.current = 0;
        }

        container.scrollTop = scrollPositionRef.current;

        animationFrameRef.current = requestAnimationFrame(scroll);
    }, [speed]);

    // 开始/停止滚动
    useEffect(() => {
        const shouldScroll = !isHovered && !paused;

        if (shouldScroll) {
            animationFrameRef.current = requestAnimationFrame(scroll);
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isHovered, paused, scroll]);

    // 鼠标事件处理
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <div
            ref={containerRef}
            className={`${css.autoScrollContainer} ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div ref={contentRef} className={`${css.scrollContent} ${contentClassName}`}>
                {/* 原始内容 */}
                {children}
                {/* 复制一份用于无缝滚动 */}
                {children}
            </div>
        </div>
    );
};

export default AutoScrollList;
