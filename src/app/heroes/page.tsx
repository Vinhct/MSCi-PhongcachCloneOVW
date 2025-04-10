'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/context/SupabaseContext';
import { AnhHung, VaiTro } from '@/loai';
import Link from 'next/link';
import Image from 'next/image';
import ThanhDieuHuongResponsive from '@/thanh_phan/thanh_dieu_huong_responsive';

export default function HeroesPage() {
  const supabase = useSupabase();
  const [heroes, setHeroes] = useState<AnhHung[]>([]);
  const [roles, setRoles] = useState<VaiTro[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách vai trò
  useEffect(() => {
    async function fetchRoles() {
      try {
        const { data, error } = await supabase
          .from('vai_tro')
          .select('*')
          .order('id');
          
        if (error) throw error;
        setRoles(data as VaiTro[]);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách vai trò:', err);
        setError('Không thể lấy danh sách vai trò');
      }
    }

    fetchRoles();
  }, [supabase]);

  // Lấy danh sách anh hùng
  useEffect(() => {
    async function fetchHeroes() {
      setLoading(true);
      setError(null);
      
      try {
        let query = supabase
          .from('anh_hung')
          .select(`
            *,
            vai_tro(id, ten, mo_ta),
            do_hi_em(id, ma, ten, mau_sac)
          `);
          
        if (selectedRole !== null) {
          query = query.eq('vai_tro_id', selectedRole);
        }
        
        const { data, error } = await query.order('ten');
        
        if (error) throw error;
        console.log("Heroes data:", data); // In ra dữ liệu để kiểm tra
        setHeroes(data as AnhHung[]);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách anh hùng:', err);
        setError('Không thể lấy danh sách anh hùng');
      } finally {
        setLoading(false);
      }
    }

    fetchHeroes();
  }, [supabase, selectedRole]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--overwatch-dark-blue)] to-[var(--overwatch-black)]">
      {/* Menu điều hướng */}
      <ThanhDieuHuongResponsive />

      {/* Hero Banner */}
      <div className="relative h-[100vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#041019]/30 to-[#041019] z-10"></div>
        <div className="absolute inset-0 bg-[url('/images/overwatch_bg_2.jpg')] bg-cover bg-center bg-no-repeat">
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-red-400 rounded-full shadow-lg shadow-red-400/50 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-red-400 rounded-full shadow-lg shadow-red-400/50 animate-pulse delay-100"></div>
            <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-red-400 rounded-full shadow-lg shadow-red-400/50 animate-pulse delay-200"></div>
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-red-400 rounded-full shadow-lg shadow-red-400/50 animate-pulse delay-300"></div>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-20">
          <h1 className="font-orbitron text-6xl md:text-8xl font-extrabold text-white tracking-tighter mb-6 uppercase text-shadow-blue animate-title-glow cyber-halo">
            <span className="relative inline-block">
              HEROES
              <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-blue-bright)] to-transparent"></div>
            </span>
          </h1>
          <p className="font-rajdhani text-xl md:text-2xl text-[var(--accent-blue-bright)] font-semibold mb-10 tracking-wide uppercase animate-fade-in">
            Khám phá danh sách anh hùng đa dạng với kỹ năng và khả năng độc đáo
          </p>
          
          {/* Nút cuộn xuống - thêm mới */}
          <div className="animate-slide-up">
            <button 
              onClick={() => document.getElementById('hero-content')?.scrollIntoView({behavior: 'smooth'})}
              className="font-rajdhani font-bold tracking-wider text-shadow-sm px-10 py-3 button-cyber clip-hexagon hexagon-border text-white"
            >
              Xem anh hùng
            </button>
          </div>
        </div>
      </div>

      <div id="hero-content" className="max-w-7xl mx-auto px-4 py-12 relative z-10 -mt-10">
        {/* Curved section top */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-[#041019] -translate-y-full"></div>
        
        {/* Filter by Role - Redesigned */}
        <div className="mb-16 backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10 shadow-xl">
          <div className="flex justify-center mb-6">
            <h2 className="font-orbitron text-2xl font-bold text-white cyber-halo">
              <span className="text-shadow-blue relative inline-block">
                 VAI TRÒ
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[var(--accent-blue-bright)] to-transparent"></div>
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedRole(null)}
              className={`px-6 py-3 text-sm font-medium font-rajdhani tracking-wider transition-all duration-300 
                ${selectedRole === null 
                ? 'text-white border-2 border-[var(--accent-blue-bright)] shadow-lg shadow-[var(--accent-blue-glow)]/40 transform scale-105 button-cyber clip-hexagon hexagon-corner-flash bg-[var(--accent-blue-bright)]/20' 
                : 'bg-white/5 text-white/90 hover:bg-[var(--accent-blue-bright)]/10 hover:text-white hover:shadow-lg hover:shadow-[var(--accent-blue-glow)]/20 border border-white/20 hover:border-[var(--accent-blue-bright)]/70 button-cyber clip-hexagon'
              }`}
            >
              Tất Cả
            </button>
            
            {roles.map((role) => {
              // Xác định màu sắc dựa trên vai trò
              const roleColor = role.id === 1 
                ? 'var(--vaiTroTank)' // Tank - vàng cam
                : role.id === 2 
                  ? 'var(--vaiTroDamage)' // Damage - đỏ
                  : role.id === 3
                    ? 'var(--vaiTroSupport)' // Support - xanh lá
                    : 'var(--accent-blue-bright)'; // Default
              
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-6 py-3 text-sm font-medium font-rajdhani tracking-wider transition-all duration-300 
                    ${selectedRole === role.id 
                      ? `text-white border-2 border-[${roleColor}] shadow-lg shadow-[${roleColor}]/40 transform scale-105 button-cyber clip-hexagon hexagon-corner-flash bg-[${roleColor}]/20` 
                      : `bg-white/5 text-white/90 hover:bg-[${roleColor}]/10 hover:text-white hover:shadow-lg hover:shadow-[${roleColor}]/20 border border-white/20 hover:border-[${roleColor}]/70 button-cyber clip-hexagon`
                    }`}
                >
                  {role.ten}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State - Improved */}
        {loading && (
          <div className="flex justify-center items-center py-32">
            <div className="relative cyber-halo">
              <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-[var(--accent-blue-bright)] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-[var(--accent-blue-glow)] animate-spin animation-delay-150"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-[var(--accent-blue-bright)] animate-spin animation-delay-300"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-[var(--accent-blue-bright)]/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error State - Enhanced */}
        {error && (
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-8 text-white text-center my-12 shadow-lg shadow-red-500/10 max-w-2xl mx-auto card-neon">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center cyber-halo">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-orbitron text-xl font-bold text-red-400 mb-2 text-shadow-sm">Đã xảy ra lỗi</h3>
            <p className="font-rajdhani text-white/80">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="font-rajdhani mt-6 px-6 py-2 tracking-wider text-shadow-sm button-cyber clip-hexagon hexagon-border"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Heroes Grid - Redesigned */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
            {heroes.map((hero, index) => (
              <Link
                key={hero.id}
                href={`/heroes/${hero.id}`}
                className="group"
              >
                <div 
                  className="relative h-72 rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform-gpu group-hover:shadow-xl animate-fadeIn card-neon"
                  style={{ 
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {/* Hero Image */}
                  <div className="absolute inset-0 bg-gray-900 overflow-hidden">
                    {hero.anh_dai_dien ? (
                      <Image
                        src={hero.anh_dai_dien}
                        alt={hero.ten}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <span className="text-white/30">Không có ảnh</span>
                      </div>
                    )}
                    
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                  </div>
                  
                  {/* Vai trò badge - top right corner */}
                  <div className="absolute top-3 right-3 z-30">
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-medium font-rajdhani flex items-center gap-1.5 backdrop-blur-sm button-cyber"
                      style={{ 
                        backgroundColor: hero.vai_tro?.id === 1 
                          ? 'rgba(245, 176, 65, 0.3)' // Tank - vàng cam
                          : hero.vai_tro?.id === 2 
                            ? 'rgba(231, 76, 60, 0.3)' // Damage - đỏ
                            : hero.vai_tro?.id === 3
                              ? 'rgba(88, 214, 141, 0.3)' // Support - xanh lá
                              : 'rgba(59, 130, 246, 0.3)', // Default - xanh dương
                        borderRight: hero.vai_tro?.id === 1
                          ? '3px solid var(--vaiTroTank)'
                          : hero.vai_tro?.id === 2
                            ? '3px solid var(--vaiTroDamage)'
                            : hero.vai_tro?.id === 3
                              ? '3px solid var(--vaiTroSupport)'
                              : '3px solid rgb(59, 130, 246)'
                      }}
                    >
                      <span 
                        className="inline-block h-2 w-2 rounded-full animate-pulse"
                        style={{ 
                          backgroundColor: hero.vai_tro?.id === 1
                            ? 'var(--vaiTroTank)'
                            : hero.vai_tro?.id === 2
                              ? 'var(--vaiTroDamage)'
                              : hero.vai_tro?.id === 3
                                ? 'var(--vaiTroSupport)'
                                : 'rgb(59, 130, 246)'
                        }}
                      ></span>
                      <span className="text-white">{hero.vai_tro?.ten || 'Không xác định'}</span>
                    </div>
                  </div>
                  
                  {/* Hero info container */}
                  <div className="absolute bottom-0 inset-x-0 p-4 z-20">
                    <h3 className="font-rajdhani text-xl font-bold text-white tracking-wide mb-2 text-shadow-blue">{hero.ten}</h3>
                    
                    {/* Rarity badge - now directly below name */}
                    <div className="flex items-center gap-2">
                      <div 
                        className="font-rajdhani px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 backdrop-blur-sm button-cyber"
                        style={{ 
                          backgroundColor: `${hero.do_hi_em?.mau_sac}30` || 'rgba(76, 175, 80, 0.2)',
                          borderLeft: `3px solid ${hero.do_hi_em?.mau_sac || '#4CAF50'}`
                        }}
                      >
                        <span 
                          className="inline-block h-2 w-2 rounded-full animate-pulse"
                          style={{ backgroundColor: hero.do_hi_em?.mau_sac || '#4CAF50' }}
                        ></span>
                        <span className="text-white">Rank: {hero.do_hi_em?.ma || 'C'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Corner decoration - top left */}
                  <div 
                    className="absolute top-0 left-0 w-12 h-12 overflow-hidden"
                  >
                    <div 
                      className="absolute top-0 left-0 w-16 h-16 -translate-x-8 -translate-y-8 rotate-45 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ 
                        background: `linear-gradient(135deg, ${hero.do_hi_em?.mau_sac || '#4CAF50'}, transparent)`
                      }}
                    ></div>
                  </div>
                  
                  {/* Glow effect on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ 
                      boxShadow: `inset 0 0 20px 5px ${hero.do_hi_em?.mau_sac}40 || rgba(76, 175, 80, 0.25)`
                    }}
                  ></div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Empty State - Enhanced */}
        {!loading && !error && heroes.length === 0 && (
          <div className="text-center py-24 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl card-neon">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-orbitron text-2xl font-bold text-white mb-3 text-shadow-blue">Không tìm thấy anh hùng</h3>
            <p className="font-rajdhani text-white/60 max-w-lg mx-auto">Không có anh hùng nào phù hợp với điều kiện tìm kiếm. Vui lòng thử lại với bộ lọc khác hoặc kiểm tra lại kết nối với Supabase.</p>
            <button 
              onClick={() => setSelectedRole(null)} 
              className="font-rajdhani mt-6 px-6 py-3 tracking-wider text-shadow-sm button-cyber clip-hexagon hexagon-border"
            >
              Xem tất cả anh hùng
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 