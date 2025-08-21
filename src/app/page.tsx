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

interface PixelState {
  color: string;
  isActive: boolean;
  customColor?: string;
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
  const [pixelStates, setPixelStates] = useState<PixelState[]>(
    Array.from({ length: 64 }, (_, index) => ({
      color: '#6366f1',
      isActive: false,
      customColor: undefined
    }))
  );
  const [presets, setPresets] = useState([
    { name: '밝은 조명', brightness: 100, color: '#f8fafc', pattern: 'solid' as const },
    { name: '부드러운 청색', brightness: 60, color: '#a5b4fc', pattern: 'pulse' as const },
    { name: '따뜻한 조명', brightness: 80, color: '#fde68a', pattern: 'solid' as const },
    { name: '무지개 효과', brightness: 70, color: '#f472b6', pattern: 'rainbow' as const }
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

  // 네오픽셀 애니메이션 업데이트
  useEffect(() => {
    let animationFrame: number;
    
    const updateAnimation = () => {
      if (neoPixelConfig.pattern === 'pulse' || neoPixelConfig.pattern === 'strobe') {
        // 강제로 리렌더링을 위한 상태 업데이트
        setNeoPixelConfig(prev => ({ ...prev }));
      }
      animationFrame = requestAnimationFrame(updateAnimation);
    };

    if (neoPixelConfig.enabled && (neoPixelConfig.pattern === 'pulse' || neoPixelConfig.pattern === 'strobe')) {
      animationFrame = requestAnimationFrame(updateAnimation);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [neoPixelConfig.enabled, neoPixelConfig.pattern]);

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
      color: '#a5b4fc',
      pattern: 'solid',
      speed: 50,
      enabled: true
    });
    setPixelStates(Array.from({ length: 64 }, () => ({
      color: '#6366f1',
      isActive: false,
      customColor: undefined
    })));
  };

  const handlePixelClick = (index: number) => {
    const pastelColors = [
      '#fecaca', '#fed7d7', '#fde68a', '#d9f99d', '#a7f3d0', 
      '#a5f3fc', '#bfdbfe', '#c7d2fe', '#ddd6fe', '#f3e8ff',
      '#fce7f3', '#fecdd3', '#fed7aa', '#fef3c7', '#ecfdf5',
      '#f0fdfa', '#f0f9ff', '#eff6ff', '#f8fafc', '#fafafa'
    ];
    
    setPixelStates(prev => {
      const newStates = [...prev];
      const currentPixel = newStates[index];
      
      if (!currentPixel.isActive) {
        // 픽셀 활성화 및 랜덤 파스텔 색상 적용
        const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        newStates[index] = {
          ...currentPixel,
          isActive: true,
          customColor: randomColor
        };
      } else {
        // 이미 활성화된 픽셀은 다른 색상으로 변경
        const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        newStates[index] = {
          ...currentPixel,
          customColor: randomColor
        };
      }
      
      return newStates;
    });
  };

  const clearAllPixels = () => {
    setPixelStates(Array.from({ length: 64 }, () => ({
      color: '#6366f1',
      isActive: false,
      customColor: undefined
    })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-indigo-100 p-8">
      {/* 헤더 */}
      <header className="glass p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl shadow-lg">
              <Microscope className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">MicroScope Control</h1>
              <p className="text-gray-600 text-lg">네오픽셀 조명 관리 시스템</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full text-lg ${
              microscopeStatus.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                microscopeStatus.connected ? 'bg-emerald-500 neopixel-glow' : 'bg-rose-500'
              }`} />
              {microscopeStatus.connected ? '연결됨' : '연결 끊김'}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-8">
        {/* 네오픽셀 조명 제어 */}
        <div className="col-span-2 space-y-8">
          {/* 메인 제어 패널 */}
          <div className="glass p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <Lightbulb className="w-7 h-7 text-amber-500" />
                네오픽셀 조명 제어
              </h2>
              <button
                onClick={togglePower}
                className={`p-4 rounded-xl transition-all shadow-lg ${
                  neoPixelConfig.enabled 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                    : 'bg-gray-400 hover:bg-gray-500 text-white'
                }`}
              >
                <Power className="w-6 h-6" />
              </button>
            </div>

            {/* 밝기 조절 */}
            <div className="mb-10">
              <label className="block text-lg font-medium text-gray-700 mb-4">
                밝기: {neoPixelConfig.brightness}%
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={neoPixelConfig.brightness}
                  onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                  className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  disabled={!neoPixelConfig.enabled}
                />
                <div 
                  className="absolute top-0 left-0 h-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg pointer-events-none"
                  style={{ width: `${neoPixelConfig.brightness}%` }}
                />
              </div>
            </div>

            {/* 색상 선택 */}
            <div className="mb-10">
              <label className="block text-lg font-medium text-gray-700 mb-4">
                색상 선택
              </label>
              <div className="flex items-center gap-6">
                <input
                  type="color"
                  value={neoPixelConfig.color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-20 h-20 rounded-xl border-2 border-gray-300 cursor-pointer shadow-lg"
                  disabled={!neoPixelConfig.enabled}
                />
                <div className="flex-1">
                  <div className="grid grid-cols-8 gap-3">
                    {[
                      '#fecaca', '#fed7d7', '#fde68a', '#d9f99d',
                      '#a7f3d0', '#a5f3fc', '#bfdbfe', '#c7d2fe',
                      '#ddd6fe', '#f3e8ff', '#fce7f3', '#fecdd3',
                      '#fed7aa', '#fef3c7', '#ecfdf5', '#f8fafc'
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:scale-110 transition-transform shadow-md"
                        style={{ backgroundColor: color }}
                        disabled={!neoPixelConfig.enabled}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 패턴 선택 */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700 mb-4">
                조명 패턴
              </label>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { value: 'solid', label: '고정', icon: '●' },
                  { value: 'pulse', label: '펄스', icon: '◐' },
                  { value: 'rainbow', label: '무지개', icon: '🌈' },
                  { value: 'strobe', label: '스트로브', icon: '⚡' }
                ].map((pattern) => (
                  <button
                    key={pattern.value}
                    onClick={() => handlePatternChange(pattern.value as NeoPixelConfig['pattern'])}
                    className={`p-5 rounded-xl border-2 transition-all btn-hover shadow-md ${
                      neoPixelConfig.pattern === pattern.value
                        ? 'border-indigo-400 bg-indigo-100 text-indigo-700'
                        : 'border-gray-300 hover:border-gray-400 text-gray-600 bg-white'
                    }`}
                    disabled={!neoPixelConfig.enabled}
                  >
                    <div className="text-3xl mb-2">{pattern.icon}</div>
                    <div className="text-base font-medium">{pattern.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 제어 버튼들 */}
            <div className="flex gap-4">
              <button
                onClick={resetSettings}
                className="flex items-center gap-3 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors btn-hover text-base shadow-md"
              >
                <RotateCcw className="w-5 h-5" />
                초기화
              </button>
              <button 
                onClick={clearAllPixels}
                className="flex items-center gap-3 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors btn-hover text-base shadow-md"
              >
                <Eye className="w-5 h-5" />
                픽셀 초기화
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors btn-hover text-base shadow-md">
                <Save className="w-5 h-5" />
                저장
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors btn-hover text-base shadow-md">
                <Download className="w-5 h-5" />
                내보내기
              </button>
            </div>
          </div>

          {/* 프리셋 */}
          <div className="glass p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <Palette className="w-6 h-6 text-purple-500" />
              조명 프리셋
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="p-5 border-2 border-gray-300 hover:border-purple-400 rounded-xl transition-all btn-hover group bg-white shadow-md"
                >
                  <div 
                    className="w-10 h-10 rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: preset.color }}
                  />
                  <div className="text-base text-gray-600 group-hover:text-purple-600 font-medium">
                    {preset.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 네오픽셀 8x8 배열 */}
        <div className="space-y-8">
          {/* 8x8 네오픽셀 그리드 */}
          <div className="glass p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <Eye className="w-6 h-6 text-indigo-500" />
              네오픽셀 8x8 배열
            </h3>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-inner">
              <div className="grid grid-cols-8 gap-2 w-fit mx-auto">
                {Array.from({ length: 64 }, (_, index) => {
                  const pixelState = pixelStates[index];
                  const isActive = neoPixelConfig.enabled;
                  
                  // 개별 픽셀 색상 또는 전체 패턴 색상
                  let pixelColor = pixelState.customColor || neoPixelConfig.color;
                  let pixelOpacity = neoPixelConfig.brightness / 100;
                  let isPixelActive = isActive && (pixelState.isActive || !pixelState.customColor);
                  
                  if (isActive && !pixelState.customColor) {
                    // 전체 패턴 적용
                    if (neoPixelConfig.pattern === 'rainbow') {
                      const hue = (index * 45) % 360;
                      pixelColor = `hsl(${hue}, 70%, 80%)`;
                    } else if (neoPixelConfig.pattern === 'pulse') {
                      pixelOpacity = (neoPixelConfig.brightness / 100) * (0.3 + 0.7 * Math.sin(Date.now() / 1000 + index * 0.1));
                    } else if (neoPixelConfig.pattern === 'strobe') {
                      pixelOpacity = Math.floor(Date.now() / 200) % 2 === 0 ? neoPixelConfig.brightness / 100 : 0.1;
                    }
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handlePixelClick(index)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:scale-110 ${
                        isPixelActive ? 'shadow-lg border-gray-300' : 'border-gray-200'
                      }`}
                      style={{
                        backgroundColor: isPixelActive ? pixelColor : '#f3f4f6',
                        opacity: isPixelActive ? pixelOpacity : 0.6,
                        boxShadow: isPixelActive ? `0 0 12px ${pixelColor}60` : 'none'
                      }}
                      title={`픽셀 ${index + 1} - 클릭하여 색상 변경`}
                    />
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <div className="text-base text-gray-600 mb-1">
                  {neoPixelConfig.enabled ? '조명 활성화' : '조명 비활성화'}
                </div>
                <div className="text-sm text-gray-500">
                  패턴: {neoPixelConfig.pattern} | 밝기: {neoPixelConfig.brightness}% | 클릭하여 개별 제어
                </div>
              </div>
            </div>
          </div>

          {/* 시스템 상태 */}
          <div className="glass p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <Activity className="w-6 h-6 text-emerald-500" />
              시스템 상태
            </h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">온도</span>
                <span className="text-gray-800 font-mono text-lg font-semibold">
                  {microscopeStatus.temperature.toFixed(1)}°C
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">전압</span>
                <span className="text-gray-800 font-mono text-lg font-semibold">
                  {microscopeStatus.voltage.toFixed(2)}V
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">전류</span>
                <span className="text-gray-800 font-mono text-lg font-semibold">
                  {microscopeStatus.current.toFixed(2)}A
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">가동시간</span>
                <span className="text-gray-800 font-mono text-lg font-semibold">
                  {microscopeStatus.uptime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 빠른 동작 패널 */}
        <div className="space-y-8">
          <div className="glass p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-amber-500" />
              빠른 동작
            </h3>
            <div className="space-y-4">
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`w-full p-4 rounded-lg transition-all btn-hover text-lg shadow-md ${
                  isRecording 
                    ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                {isRecording ? '● 녹화 중지' : '● 녹화 시작'}
              </button>
              <button className="w-full p-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors btn-hover text-lg shadow-md">
                📸 스냅샷 촬영
              </button>
              <button className="w-full p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors btn-hover text-lg shadow-md">
                <Settings className="w-5 h-5 inline mr-3" />
                고급 설정
              </button>
              <button className="w-full p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors btn-hover text-lg shadow-md">
                <Upload className="w-5 h-5 inline mr-3" />
                설정 가져오기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}