#!/usr/bin/env python3
"""
Portfolio Error Checker
Validates all files and reports potential issues
"""

import os
import json
from pathlib import Path

def check_portfolio_files():
    """Check all portfolio files for common issues"""
    
    portfolio_dir = Path(".")
    issues = []
    
    # Check required files
    required_files = [
        "index.html",
        "main.js", 
        "main.css",
        "about.css",
        "about.js",
        "dynamic-loader.js",
        "skills-visualizer.js",
        "dynamic-theme.css",
        "enhanced-features.js"
    ]
    
    print("🔍 Checking required files...")
    for file in required_files:
        if not (portfolio_dir / file).exists():
            issues.append(f"❌ Missing required file: {file}")
        else:
            print(f"✅ Found: {file}")
    
    # Check generated content
    print("\n🔍 Checking generated content...")
    generated_dir = portfolio_dir / "generated_content"
    if generated_dir.exists():
        generated_files = [
            "portfolio_stats.json",
            "dynamic_variables.css",
            "dynamic_skills.html",
            "dynamic_projects.html",
            "background_particles.json",
            "performance_metrics.json"
        ]
        
        for file in generated_files:
            if not (generated_dir / file).exists():
                issues.append(f"❌ Missing generated file: {file}")
            else:
                print(f"✅ Generated: {file}")
    else:
        issues.append("❌ Missing generated_content directory")
    
    # Check JSON validity
    print("\n🔍 Checking JSON files...")
    json_files = ["portfolio_api.json"]
    if generated_dir.exists():
        json_files.extend([
            "generated_content/portfolio_stats.json",
            "generated_content/background_particles.json", 
            "generated_content/performance_metrics.json"
        ])
    
    for json_file in json_files:
        try:
            if (portfolio_dir / json_file).exists():
                with open(portfolio_dir / json_file, 'r') as f:
                    json.load(f)
                print(f"✅ Valid JSON: {json_file}")
            else:
                issues.append(f"❌ Missing JSON file: {json_file}")
        except json.JSONDecodeError as e:
            issues.append(f"❌ Invalid JSON in {json_file}: {str(e)}")
    
    # Check CSS syntax (basic)
    print("\n🔍 Checking CSS files...")
    css_files = [f for f in portfolio_dir.glob("*.css")]
    css_files.extend(portfolio_dir.glob("generated_content/*.css"))
    
    for css_file in css_files:
        try:
            content = css_file.read_text(encoding='utf-8')
            # Basic bracket matching
            open_braces = content.count('{')
            close_braces = content.count('}')
            if open_braces != close_braces:
                issues.append(f"❌ CSS bracket mismatch in {css_file.name}: {open_braces} {{ vs {close_braces} }}")
            else:
                print(f"✅ CSS syntax OK: {css_file.name}")
        except Exception as e:
            issues.append(f"❌ Error reading CSS {css_file.name}: {str(e)}")
    
    # Check JavaScript basic syntax
    print("\n🔍 Checking JavaScript files...")
    js_files = [f for f in portfolio_dir.glob("*.js") if f.name != "portfolio_checker.py"]
    
    for js_file in js_files:
        try:
            content = js_file.read_text(encoding='utf-8')
            # Basic syntax checks
            if content.count('(') != content.count(')'):
                issues.append(f"❌ JS parentheses mismatch in {js_file.name}")
            elif content.count('{') != content.count('}'):
                issues.append(f"❌ JS brace mismatch in {js_file.name}")
            else:
                print(f"✅ JS syntax OK: {js_file.name}")
        except Exception as e:
            issues.append(f"❌ Error reading JS {js_file.name}: {str(e)}")
    
    # Summary
    print(f"\n📊 PORTFOLIO CHECK SUMMARY")
    print(f"=" * 40)
    
    if not issues:
        print("🎉 All checks passed! Portfolio is ready.")
        print("✨ No critical issues found.")
    else:
        print(f"⚠️  Found {len(issues)} issues:")
        for issue in issues:
            print(f"   {issue}")
        
        print(f"\n💡 RECOMMENDATIONS:")
        print("   • Fix missing files")
        print("   • Validate JSON syntax")
        print("   • Check CSS/JS syntax")
        print("   • Re-run Python generator if needed")
    
    print(f"\n🚀 To fix issues, run:")
    print("   python portfolio_generator.py")
    print("   Check file paths and syntax")

if __name__ == "__main__":
    print("🔧 Portfolio Error Checker v1.0")
    print("=" * 40)
    check_portfolio_files()
