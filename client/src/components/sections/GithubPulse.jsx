import React from 'react';
import { GitHubCalendar }from 'react-github-calendar';
import { motion } from 'framer-motion';

export default function GithubPulse() {
    const selectLastDays = (contributions) => {
        const today = new Date();
        const priorDate = new Date().setDate(today.getDate() - 180); // Show last 6 months
        return contributions.filter((activity) => {
            const date = new Date(activity.date);
            return date >= priorDate && date <= today;
        });
    };

    const theme = {
        light: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
        dark: ['#161b22', '#0d2d5e', '#1e40af', '#3b82f6', '#60a5fa'], // Custom blue theme
    };

    return (
        <section className="py-12 bg-navy-950/50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="card-base p-8 border border-white/5 bg-navy-900/40 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h3 className="text-white font-bold text-xl flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                Tech Pulse
                            </h3>
                            <p className="text-slate-500 text-sm font-mono mt-1">Live GitHub Contribution Stream</p>
                        </div>
                        <a
                            href="https://github.com/Nagaraj-Jakkappa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-blue-400 hover:text-white transition-colors"
                        >
                            @Nagaraj-Jakkappa →
                        </a>
                    </div>

                    <div className="flex justify-center overflow-hidden">
                        <GitHubCalendar
                            username="Nagaraj-Jakkappa"
                            transformData={selectLastDays}
                            labels={{
                                totalCount: "{{count}} contributions in the last 6 months",
                            }}
                            theme={theme}
                            fontSize={12}
                            blockSize={12}
                            blockMargin={4}
                            colorScheme="dark"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}