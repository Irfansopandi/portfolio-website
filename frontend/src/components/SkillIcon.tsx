import { useState } from 'react';
import { Code2 } from 'lucide-react';

interface SkillIconProps {
  name: string;
  icon?: string;
  className?: string;
}

export function getSkillIconUrl(iconOrName: string): string | null {
  if (!iconOrName) return null;
  const cleanName = iconOrName.toLowerCase().trim().replace(/[\s\.\-_]+/g, '');
  
  const map: Record<string, string> = {
    react: 'react/react-original.svg',
    reactjs: 'react/react-original.svg',
    javascript: 'javascript/javascript-original.svg',
    js: 'javascript/javascript-original.svg',
    typescript: 'typescript/typescript-original.svg',
    ts: 'typescript/typescript-original.svg',
    nodejs: 'nodejs/nodejs-original.svg',
    node: 'nodejs/nodejs-original.svg',
    express: 'express/express-original.svg',
    expressjs: 'express/express-original.svg',
    nextjs: 'nextjs/nextjs-original.svg',
    python: 'python/python-original.svg',
    tailwind: 'tailwindcss/tailwindcss-original.svg',
    tailwindcss: 'tailwindcss/tailwindcss-original.svg',
    css: 'css3/css3-original.svg',
    css3: 'css3/css3-original.svg',
    html: 'html5/html5-original.svg',
    html5: 'html5/html5-original.svg',
    mysql: 'mysql/mysql-original.svg',
    mongodb: 'mongodb/mongodb-original.svg',
    mongo: 'mongodb/mongodb-original.svg',
    postgresql: 'postgresql/postgresql-original.svg',
    postgres: 'postgresql/postgresql-original.svg',
    git: 'git/git-original.svg',
    github: 'github/github-original.svg',
    gitlab: 'gitlab/gitlab-original.svg',
    figma: 'figma/figma-original.svg',
    docker: 'docker/docker-original.svg',
    laravel: 'laravel/laravel-original.svg',
    php: 'php/php-original.svg',
    bootstrap: 'bootstrap/bootstrap-original.svg',
    redis: 'redis/redis-original.svg',
    rust: 'rust/rust-original.svg',
    vue: 'vuejs/vuejs-original.svg',
    vuejs: 'vuejs/vuejs-original.svg',
    angular: 'angularjs/angularjs-original.svg',
    angularjs: 'angularjs/angularjs-original.svg',
    svelte: 'svelte/svelte-original.svg',
    firebase: 'firebase/firebase-plain.svg',
    flutter: 'flutter/flutter-original.svg',
    dart: 'dart/dart-original.svg',
    vscode: 'vscode/vscode-original.svg',
    postman: 'postman/postman-original.svg',
    yarn: 'yarn/yarn-original.svg',
    npm: 'npm/npm-original-wordmark.svg',
    vite: 'vite/vite-original.svg',
    webpack: 'webpack/webpack-original.svg',
    linux: 'linux/linux-original.svg',
    ubuntu: 'ubuntu/ubuntu-original.svg',
    aws: 'amazonwebservices/amazonwebservices-original-wordmark.svg',
    googlecloud: 'googlecloud/googlecloud-original.svg',
    gcp: 'googlecloud/googlecloud-original.svg',
    digitalocean: 'digitalocean/digitalocean-original.svg',
    sqlite: 'sqlite/sqlite-original.svg',
    graphql: 'graphql/graphql-plain.svg',
    prisma: 'prisma/prisma-original.svg',
    redux: 'redux/redux-original.svg',
    sass: 'sass/sass-original.svg',
    c: 'c/c-original.svg',
    cplusplus: 'cplusplus/cplusplus-original.svg',
    cpp: 'cplusplus/cplusplus-original.svg',
    csharp: 'csharp/csharp-original.svg',
    cs: 'csharp/csharp-original.svg',
    java: 'java/java-original.svg',
    kotlin: 'kotlin/kotlin-original.svg',
    swift: 'swift/swift-original.svg',
    go: 'go/go-original.svg',
    golang: 'go/go-original.svg',
    ruby: 'ruby/ruby-original.svg',
    kubernetes: 'kubernetes/kubernetes-plain.svg',
    k8s: 'kubernetes/kubernetes-plain.svg',
    canva: 'canva/canva-original.svg',
    wordpress: 'wordpress/wordpress-plain.svg',
    excel: 'https://api.iconify.design/vscode-icons/file-type-excel.svg',
    microsoftexcel: 'https://api.iconify.design/vscode-icons/file-type-excel.svg',
    powerpoint: 'https://api.iconify.design/vscode-icons/file-type-powerpoint.svg',
    microsoftpowerpoint: 'https://api.iconify.design/vscode-icons/file-type-powerpoint.svg',
    antigravity: 'google/google-original.svg',
  };

  if (cleanName === 'nextjs') {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg';
  }
  if (cleanName === 'firebase') {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg';
  }

  const path = map[cleanName];
  if (path) {
    if (path.startsWith('http')) return path;
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;
  }
  return null;
}

export const SkillIcon = ({ name, icon, className = 'w-full h-full p-0.5' }: SkillIconProps) => {
  const [hasError, setHasError] = useState(false);
  const iconUrl = getSkillIconUrl(icon || name);

  if (iconUrl && !hasError) {
    return (
      <img
        src={iconUrl}
        alt={name}
        className={`object-contain ${className}`}
        onError={() => setHasError(true)}
      />
    );
  }

  return <Code2 className={`text-indigo-400/80 ${className}`} />;
};

export default SkillIcon;
