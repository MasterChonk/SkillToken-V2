"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookUser, CheckCircle, Shield, Users, Zap, Trophy, Globe, Star, ChevronRight, Play, Download, Award } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,69,219,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,219,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        
        <div className="container mx-auto text-center z-10">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full text-sm font-medium border border-purple-500/30 backdrop-blur-sm">
              🚀 Революция в образовании Web3
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
            SkillToken DAO
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Децентрализованная образовательная платформа для изучения Web3, где знания превращаются в 
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold"> NFT сертификаты</span>, 
            а сообщество управляет будущим образования
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">            <Button
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              asChild
            >
              <Link href="/courses">
                Начать обучение
              </Link>
            </Button>                        <Button               className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black text-lg font-semibold rounded-full transition-all duration-300 backdrop-blur-sm bg-transparent"              asChild            >              <Link href="/governance">                <span className="flex items-center">                  <Users className="mr-2 h-6 w-6" />                  Присоединиться к DAO                </span>              </Link>            </Button>          </div>
          
          {/* Hero Visual */}
          <div className="relative mx-auto w-full max-w-4xl h-96 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-transparent to-cyan-900/50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-1">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <Zap className="w-16 h-16 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Blockchain Education Reimagined</h3>
                <p className="text-gray-300">Создавайте • Изучайте • Сертифицируйтесь • Управляйте</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Возможности платформы
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Современные инструменты для создания, изучения и верификации навыков в Web3
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <Card className="group bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                  <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                    <BookUser className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors">
                  Интерактивные курсы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Изучайте Solidity, DeFi, NFT и Web3 с помощью практических заданий и реальных проектов
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 p-1">
                  <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-cyan-300 transition-colors">
                  NFT Сертификаты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Получайте уникальные Soulbound NFT токены как подтверждение ваших навыков
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-green-500/20 backdrop-blur-sm hover:border-green-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 p-1">
                  <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-green-300 transition-colors">
                  DAO Управление
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Участвуйте в принятии решений о развитии платформы через децентрализованное управление
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-yellow-500/20 backdrop-blur-sm hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 p-1">
                  <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-yellow-300 transition-colors">
                  Верификация навыков
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Мгновенная проверка подлинности сертификатов благодаря блокчейн технологии
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-pink-500/20 backdrop-blur-sm hover:border-pink-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 p-1">
                  <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-pink-300 transition-colors">
                  Глобальное сообщество
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Общайтесь с единомышленниками и экспертами со всего мира в нашей DAO
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-indigo-500/20 backdrop-blur-sm hover:border-indigo-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-indigo-400 to-purple-500 p-1">
                  <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-indigo-300 transition-colors">
                  Достижения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Зарабатывайте уникальные значки и награды за успехи в обучении
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* NFT Certificate Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-cyan-900/20 border border-purple-500/30 backdrop-blur-sm p-12 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500 to-transparent"></div>
            </div>
            
            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Soulbound NFT Сертификаты
                </h2>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Получайте уникальные неперемещаемые NFT токены как неопровержимое доказательство ваших навыков. 
                  Эти цифровые сертификаты навсегда привязаны к вашему кошельку и не могут быть подделаны.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-gray-300">Неподдельные и проверяемые</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-gray-300">Признаются работодателями Web3</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-gray-300">Хранятся вечно в блокчейне</span>
                  </div>
                </div>
                
                                                <Button                   className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"                  asChild                >                  <Link href="/certificates">                    <span className="flex items-center">                      <Download className="mr-2 h-6 w-6" />                      Получить сертификат                    </span>                  </Link>                </Button>
              </div>
              
              <div className="relative">
                <div className="w-full h-96 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 p-1 animate-pulse">
                      <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                        <Award className="w-16 h-16 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">SkillToken Certificate #001</h3>
                    <p className="text-gray-400">Solidity Developer</p>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Выдан: 15.01.2025</p>
                      <p>Токен: 0x1234...5678</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Governance */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Сообщество и управление
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Присоединяйтесь к децентрализованному сообществу, где каждый голос имеет значение
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-cyan-500/20 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 p-1">
                  <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-white">Голосование</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Участвуйте в принятии ключевых решений о развитии платформы через DAO голосования
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-green-500/20 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 p-1">
                  <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-white">Предложения</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Создавайте предложения по улучшению платформы и влияйте на её будущее
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-purple-500/20 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-500 p-1">
                  <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-white">Награды</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">
                  Получайте токены за активное участие в жизни сообщества и обучении
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-r from-gray-900/50 via-purple-900/20 to-gray-900/50 border border-purple-500/30 backdrop-blur-sm p-12 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 animate-pulse"></div>
            </div>
            
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Готовы начать путешествие в Web3?
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Присоединяйтесь к SkillToken DAO сегодня и станьте частью будущего децентрализованного образования
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                                <Button                   className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"                  asChild                >                  <Link href="/register">                    <span className="flex items-center">                      Присоединиться сейчас                      <ChevronRight className="ml-2 h-6 w-6" />                    </span>                  </Link>                </Button>                                <Button                   className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black text-lg font-semibold rounded-full transition-all duration-300 backdrop-blur-sm bg-transparent"                  asChild                >                  <Link href="/verify">                    <span className="flex items-center">                      <Shield className="mr-2 h-6 w-6" />                      Проверить сертификат                    </span>                  </Link>                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
