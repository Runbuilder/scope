'use client';

import { useState, useEffect } from 'react';
import { 
  Microscope, 
  Lightbulb, 
  Settings, 
  Activity, 
  Zap, 
  Eye,
  Palette,
  Power,
  RotateCcw,
  Save,
  Download,
  Upload
} from 'lucide-react';

interface NeoPixelConfig {
  brightness: number;
  color: string;
  pattern: 'solid' | 'pulse' | 'rainbow' | 'strobe';
  speed: number;
  enabled: boolean;
}

interface MicroscopeStatus {
  connected: boolean;
  temperature: number;
  voltage: number;
  current: number;
  uptime: string;
}

export default function MicroscopeControl() {
  const [neoPixelConfig, setNeoPixelConfig] = useState<NeoPixelConfig>({
    brightness: 75,
    color: '#00d4ff',
    pattern: 'solid',
    speed: 50,
    enabled: true
  });

  const [microscopeStatus, setMicroscopeStatus] = useState<MicroscopeStatus>({
    connected: true,
    temperature: 23.5,
    voltage: 5.0,
    current: 0.85,
    uptime: '2h 34m'
  });

  const [isRecording, setIsRecording] = useState(false);
  const [presets, setPresets] = useState([
    { name: '밝은 조명', brightness: 100, color: '#ffffff', pattern: 'solid' as const },
    { name: '부드러운 청색', brightness: 60, color: '#00d4ff', pattern: 'pulse' as const },
    { name: '따뜻한 조명', brightness: 80, color: '#fbbf24', pattern: 'solid' as const },
    { name: '무지개 효과', brightness: 70, color: '#ff0000', pattern: 'rainbow' as const }
  ]);

  // 실시간 상태 업데이트 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setMicroscopeStatus(prev => ({
        ...prev,
        temperature: 23.5 + (Math.random() - 0.5) * 2,
        voltage: 5.0 + (Math.random() - 0.5) * 0.1,
        current: 0.85 + (Math.random() - 0.5) * 0.2
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleBrightnessChange = (value: number) => {
    setNeoPixelConfig(prev => ({ ...prev, brightness: value }));
  };

  const handleColorChange = (color: string) => {
    setNeoPixelConfig(prev => ({ ...prev, color }));
  };

  const handlePatternChange = (pattern: NeoPixelConfig['pattern']) => {
    setNeoPixelConfig(prev => ({ ...prev, pattern }));
  };

  const applyPreset = (preset: any) => {
    setNeoPixelConfig(prev => ({
      ...prev,
      brightness: preset.brightness,
      color: preset.color,
      pattern: preset.pattern
    }));
  };

  const togglePower = () => {
    setNeoPixelConfig(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const resetSettings = () => {
    setNeoPixelConfig({
      brightness: 75,
      color: '#00d4ff',
      pattern: 'solid',
      speed: 50,
      enabled: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* 헤더 */}
      <header className="glass p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Microscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MicroScope Control</h1>
              <p className="text-gray-300">네오픽셀 조명 관리 시스템</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              microscopeStatus.connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                microscopeStatus.connected ? 'bg-green-400 neopixel-glow' : 'bg-red-400'
              }`} />
              {microscopeStatus.connected ? '연결됨' : '연결 끊김'}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 네오픽셀 조명 제어 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 메인 제어 패널 */}
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                네오픽셀 조명 제어
              </h2>
              <button
                onClick={togglePower}
                className={`p-3 rounded-xl transition-all ${
                  neoPixelConfig.enabled 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                }`}
              >
                <Power className="w-5 h-5" />
              </button>
            </div>

            {/* 밝기 조절 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                밝기: {neoPixelConfig.brightness}%
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={neoPixelConfig.brightness}
                  onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  disabled={!neoPixelConfig.enabled}
                />
                <div 
                  className="absolute top-0 left-0 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg pointer-events-none"
                  style={{ width: `${neoPixelConfig.brightness}%` }}
                />
              </div>
            </div>

            {/* 색상 선택 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                색상 선택
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={neoPixelConfig.color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-16 h-16 rounded-xl border-2 border-gray-600 cursor-pointer"
                  disabled={!neoPixelConfig.enabled}
                />
                <div className="flex-1">
                  <div className="grid grid-cols-8 gap-2">
                    {[
                      '#ffffff', '#ff0000', '#00ff00', '#0000ff',
                      '#ffff00', '#ff00ff', '#00ffff', '#ffa500',
                      '#800080', '#008000', '#000080', '#800000',
                      '#808000', '#008080', '#c0c0c0', '#808080'
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-8 h-8 rounded-lg border-2 border-gray-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        disabled={!neoPixelConfig.enabled}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 패턴 선택 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                조명 패턴
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'solid', label: '고정', icon: '●' },
                  { value: 'pulse', label: '펄스', icon: '◐' },
                  { value: 'rainbow', label: '무지개', icon: '🌈' },
                  { value: 'strobe', label: '스트로브', icon: '⚡' }
                ].map((pattern) => (
                  <button
                    key={pattern.value}
                    onClick={() => handlePatternChange(pattern.value as NeoPixelConfig['pattern'])}
                    className={`p-4 rounded-xl border-2 transition-all btn-hover ${
                      neoPixelConfig.pattern === pattern.value
                        ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                    }`}
                    disabled={!neoPixelConfig.enabled}
                  >
                    <div className="text-2xl mb-1">{pattern.icon}</div>
                    <div className="text-sm">{pattern.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 제어 버튼들 */}
            <div className="flex gap-3">
              <button
                onClick={resetSettings}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors btn-hover"
              >
                <RotateCcw className="w-4 h-4" />
                초기화
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors btn-hover">
                <Save className="w-4 h-4" />
                저장
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors btn-hover">
                <Download className="w-4 h-4" />
                내보내기
              </button>
            </div>
          </div>

          {/* 프리셋 */}
          <div className="glass p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              조명 프리셋
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="p-4 border-2 border-gray-600 hover:border-purple-500 rounded-xl transition-all btn-hover group"
                >
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-2 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: preset.color }}
                  />
                  <div className="text-sm text-gray-300 group-hover:text-white">
                    {preset.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 사이드바 - 상태 모니터링 */}
        <div className="space-y-6">
          {/* 현미경 상태 */}
          <div className="glass p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              시스템 상태
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">온도</span>
                <span className="text-white font-mono">
                  {microscopeStatus.temperature.toFixed(1)}°C
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">전압</span>
                <span className="text-white font-mono">
                  {microscopeStatus.voltage.toFixed(2)}V
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">전류</span>
                <span className="text-white font-mono">
                  {microscopeStatus.current.toFixed(2)}A
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">가동시간</span>
                <span className="text-white font-mono">
                  {microscopeStatus.uptime}
                </span>
              </div>
            </div>
          </div>

          {/* 실시간 미리보기 */}
          <div className="glass p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              조명 미리보기
            </h3>
            <div className="relative">
              <div className="w-full h-32 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
                <div 
                  className={`w-20 h-20 rounded-full transition-all duration-500 ${
                    neoPixelConfig.enabled ? 'neopixel-glow' : ''
                  }`}
                  style={{ 
                    backgroundColor: neoPixelConfig.enabled ? neoPixelConfig.color : '#333',
                    opacity: neoPixelConfig.enabled ? neoPixelConfig.brightness / 100 : 0.3
                  }}
                />
              </div>
              <div className="mt-3 text-center">
                <div className="text-sm text-gray-400">
                  {neoPixelConfig.enabled ? '조명 켜짐' : '조명 꺼짐'}
                </div>
                <div className="text-xs text-gray-500">
                  {neoPixelConfig.pattern} 패턴
                </div>
              </div>
            </div>
          </div>

          {/* 빠른 동작 */}
          <div className="glass p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              빠른 동작
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`w-full p-3 rounded-lg transition-all btn-hover ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {isRecording ? '● 녹화 중지' : '● 녹화 시작'}
              </button>
              <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors btn-hover">
                스냅샷 촬영
              </button>
              <button className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors btn-hover">
                <Settings className="w-4 h-4 inline mr-2" />
                고급 설정
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}