const domainUtils = {
	normalizeDomain(domain) {
		if (!domain || typeof domain !== 'string') {
			return ''
		}
		return domain.trim().toLowerCase().replace(/^\.+|\.+$/g, '')
	},

	getEnvDomains(domainList) {
		if (!domainList) {
			return []
		}
		if (typeof domainList === 'string') {
			try {
				domainList = JSON.parse(domainList)
			} catch (error) {
				return []
			}
		}
		if (!Array.isArray(domainList)) {
			return []
		}
		return domainList
			.map(item => this.normalizeDomain(item))
			.filter(Boolean)
	},

	findMatchedDomain(domain, allowDomains = []) {
		const curDomain = this.normalizeDomain(domain)
		const roots = this.getEnvDomains(allowDomains).sort((a, b) => b.length - a.length)
		for (const root of roots) {
			if (curDomain === root || curDomain.endsWith(`.${root}`)) {
				return root
			}
		}
		return null
	},

	isAllowedDomain(domain, allowDomains = []) {
		return !!this.findMatchedDomain(domain, allowDomains)
	},

	isInternalEmail(email, allowDomains = []) {
		const domain = email?.split('@')?.[1]
		return this.isAllowedDomain(domain, allowDomains)
	},

	toOssDomain(domain) {

		if (!domain) {
			return null
		}

		if (!domain.startsWith('http')) {
			return 'https://' + domain
		}

		if (domain.endsWith("/")) {
			domain = domain.slice(0, -1);
		}

		return domain
	}
}

export default  domainUtils
